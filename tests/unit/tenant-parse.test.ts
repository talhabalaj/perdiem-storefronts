import { describe, expect, it } from "vite-plus/test";
import { normalizeHost, parseStoreRequest, parseTenantKey, toTenantKey } from "@/lib/tenant/parse";

const parse = (host: string | null, pathname = "/", rootDomain = "localhost") =>
  parseStoreRequest({ host, pathname, rootDomain });

describe("normalizeHost", () => {
  it.each([
    ["Luna.LocalHost:3000", "luna.localhost"],
    ["order.lunacafe.test.", "order.lunacafe.test"],
    ["[::1]:3000", "[::1]"],
    ["  example.com  ", "example.com"],
    [null, ""],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeHost(input)).toBe(expected);
  });
});

describe("parseStoreRequest", () => {
  it("treats the root domain, loopback and missing host as the platform", () => {
    expect(parse("localhost:3000")).toEqual({ kind: "platform" });
    expect(parse("127.0.0.1:3000")).toEqual({ kind: "platform" });
    expect(parse(null)).toEqual({ kind: "platform" });
  });

  it("resolves store subdomains, case- and port-insensitively", () => {
    expect(parse("luna.localhost:3000")).toEqual({ kind: "subdomain", slug: "luna" });
    expect(parse("GREEN-BOWL.localhost")).toEqual({ kind: "subdomain", slug: "green-bowl" });
    expect(parse("smokestack.perdiem.app", "/", "perdiem.app")).toEqual({
      kind: "subdomain",
      slug: "smokestack",
    });
  });

  it("keeps reserved subdomains on the platform", () => {
    expect(parse("www.localhost")).toEqual({ kind: "platform" });
    expect(parse("admin.localhost", "/admin")).toEqual({ kind: "platform" });
  });

  it("sends anything else to custom-domain lookup", () => {
    expect(parse("order.lunacafe.test:3000")).toEqual({
      kind: "domain",
      hostname: "order.lunacafe.test",
    });
    // Nested subdomains are not store slugs; only an explicit domain record can match.
    expect(parse("a.b.localhost")).toEqual({ kind: "domain", hostname: "a.b.localhost" });
    // A look-alike root must not be mistaken for a subdomain of the real one.
    expect(parse("luna.notlocalhost")).toEqual({ kind: "domain", hostname: "luna.notlocalhost" });
  });

  it("supports /s/<slug> path routing on the platform host only", () => {
    expect(parse("localhost", "/s/luna")).toEqual({ kind: "path", slug: "luna", rest: "" });
    expect(parse("localhost", "/s/Luna/api/menu")).toEqual({
      kind: "path",
      slug: "luna",
      rest: "/api/menu",
    });
    expect(parse("localhost", "/s/not_a_slug")).toEqual({ kind: "platform" });
    expect(parse("luna.localhost", "/s/smokestack")).toEqual({ kind: "subdomain", slug: "luna" });
  });
});

describe("tenant keys", () => {
  it("round-trips every route kind", () => {
    expect(parseTenantKey(toTenantKey({ kind: "subdomain", slug: "luna" }))).toEqual({
      mode: "sub",
      slug: "luna",
    });
    expect(parseTenantKey(toTenantKey({ kind: "path", slug: "luna", rest: "" }))).toEqual({
      mode: "path",
      slug: "luna",
    });
    expect(parseTenantKey(encodeURIComponent("dom~order.lunacafe.test"))).toEqual({
      mode: "dom",
      hostname: "order.lunacafe.test",
    });
  });

  it("rejects malformed keys", () => {
    for (const bad of ["luna", "~luna", "sub~", "sub~Bad Slug", "evil~luna"]) {
      expect(parseTenantKey(bad)).toBeNull();
    }
  });
});
