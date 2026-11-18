import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseStoreRequest, toTenantKey } from "@/lib/tenant/parse";
import { storeExists } from "@/lib/tenant/registry";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "localhost";

/**
 * Maps the public URL (host + path) onto the internal tenant route /t/<key>/...
 * An address no store answers to is rewritten to a prerendered 404 page here, because with
 * streaming the status can only be set before the response starts.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The internal tenant tree is only reachable through this rewrite.
  if (pathname === "/t" || pathname.startsWith("/t/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const route = parseStoreRequest({
    host: request.headers.get("host"),
    pathname,
    rootDomain: ROOT_DOMAIN,
  });
  if (route.kind === "platform") return NextResponse.next();
  if (!storeExists(route)) return NextResponse.rewrite(new URL("/store-not-found", request.url));

  const rest = route.kind === "path" ? route.rest : pathname;
  const target = new URL(
    `/t/${toTenantKey(route)}${rest === "/" ? "" : rest}${search}`,
    request.url,
  );
  return NextResponse.rewrite(target);
}

export const config = {
  // Platform-level static files (the platform favicon) are shared by every host.
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr|icon\\.svg|logos/).*)"],
};
