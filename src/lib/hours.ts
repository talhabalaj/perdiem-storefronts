import type { Hours } from "@/lib/schemas";

export type OpenStatus =
  | { isOpen: true; closesAt: string }
  | { isOpen: false; opensAt: { day: number; time: string; isToday: boolean } | null };

const MINUTES_PER_DAY = 24 * 60;
const toMinutes = (hhmm: string): number => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const isOvernight = (range: { open: string; close: string }) =>
  toMinutes(range.close) <= toMinutes(range.open);

/** Day-of-week and minutes-since-midnight for `now` as seen on the store's wall clock. */
export function storeClock(now: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function getOpenStatus(hours: Hours, timeZone: string, now: Date): OpenStatus {
  const { day, minutes } = storeClock(now, timeZone);
  const yesterday = (day + 6) % 7;

  const current = hours.find((r) => {
    const open = toMinutes(r.open);
    const close = toMinutes(r.close);
    if (r.day === day) return minutes >= open && (isOvernight(r) || minutes < close);
    // Yesterday's late shift that runs past midnight.
    return r.day === yesterday && isOvernight(r) && minutes < close;
  });
  if (current) return { isOpen: true, closesAt: current.close };

  return { isOpen: false, opensAt: nextOpening(hours, day, minutes) };
}

function nextOpening(hours: Hours, day: number, minutes: number) {
  for (let offset = 0; offset < 7; offset += 1) {
    const candidateDay = (day + offset) % 7;
    const opening = hours
      .filter((r) => r.day === candidateDay)
      .map((r) => r.open)
      .filter((open) => offset > 0 || toMinutes(open) > minutes)
      .toSorted((a, b) => toMinutes(a) - toMinutes(b))[0];
    if (opening) return { day: candidateDay, time: opening, isToday: offset === 0 };
  }
  return null;
}

/** "9 PM" / "10:30" style, following the store's locale. */
export function formatClockTime(hhmm: string, locale: string): string {
  const total = toMinutes(hhmm) % MINUTES_PER_DAY;
  const date = new Date(Date.UTC(2000, 0, 1, Math.floor(total / 60), total % 60));
  const uses24h =
    new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle !== "h12";
  // "9 PM" reads fine in 12h locales; a bare "21" does not, so 24h locales keep the minutes.
  const showMinutes = uses24h || total % 60 !== 0;
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    ...(showMinutes ? { minute: "2-digit" } : {}),
    timeZone: "UTC",
  }).format(date);
}

/** 2000-01-02 was a Sunday, so day N is the 2nd + N. */
export function formatWeekday(day: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(2000, 0, 2 + day)),
  );
}

/** Plain-language status: "Open until 5 PM", "Opens at 7 AM", "Opens Tue at 7 AM". */
export function describeOpenStatus(status: OpenStatus, locale: string): string {
  if (status.isOpen) return `Open until ${formatClockTime(status.closesAt, locale)}`;
  if (!status.opensAt) return "Closed";
  const time = formatClockTime(status.opensAt.time, locale);
  return status.opensAt.isToday
    ? `Opens at ${time}`
    : `Opens ${formatWeekday(status.opensAt.day, locale)} at ${time}`;
}
