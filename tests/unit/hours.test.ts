import { describe, expect, it } from "vite-plus/test";
import { describeOpenStatus, getOpenStatus } from "@/lib/hours";
import type { Hours } from "@/lib/schemas";

const weekdays7to17: Hours = [1, 2, 3, 4, 5].map((day) => ({ day, open: "07:00", close: "17:00" }));
const lateFridays: Hours = [
  { day: 3, open: "11:00", close: "21:00" },
  { day: 5, open: "11:00", close: "01:00" },
];

const status = (hours: Hours, tz: string, iso: string, locale = "en-US") =>
  describeOpenStatus(getOpenStatus(hours, tz, new Date(iso)), locale);

describe("getOpenStatus", () => {
  // 2026-11-16 is a Monday. New York is UTC-5 in November.
  it("is open during the store's local hours, not the server's", () => {
    expect(status(weekdays7to17, "America/New_York", "2026-11-16T15:00:00Z")).toBe(
      "Open until 5 PM",
    );
    // Same instant-ish, but 18:00 Monday in Tokyo (UTC+9): already closed for the day.
    expect(status(weekdays7to17, "Asia/Tokyo", "2026-11-16T09:00:00Z")).toBe("Opens Tue at 7 AM");
  });

  it("reports the next opening later today or on a later day", () => {
    expect(status(weekdays7to17, "America/New_York", "2026-11-16T10:00:00Z")).toBe("Opens at 7 AM");
    expect(status(weekdays7to17, "America/New_York", "2026-11-21T15:00:00Z")).toBe(
      "Opens Mon at 7 AM",
    );
  });

  it("handles shifts that run past midnight", () => {
    // Saturday 00:30 in Chicago (UTC-6) is still Friday's late shift.
    expect(status(lateFridays, "America/Chicago", "2026-11-21T06:30:00Z")).toBe("Open until 1 AM");
    // Saturday 01:30: Friday's shift is over and nothing opens until Wednesday.
    expect(status(lateFridays, "America/Chicago", "2026-11-21T07:30:00Z")).toBe(
      "Opens Wed at 11 AM",
    );
  });

  it("formats times in the store's locale", () => {
    const hours: Hours = [{ day: 1, open: "10:30", close: "21:00" }];
    expect(status(hours, "Europe/London", "2026-11-16T09:00:00Z", "en-GB")).toBe("Opens at 10:30");
    // 24h locales keep the minutes on the hour ("21:00", not a bare "21").
    expect(status(hours, "Europe/London", "2026-11-16T12:00:00Z", "en-GB")).toBe(
      "Open until 21:00",
    );
  });

  it("says Closed when there are no hours at all", () => {
    expect(status([], "UTC", "2026-11-16T12:00:00Z")).toBe("Closed");
  });
});
