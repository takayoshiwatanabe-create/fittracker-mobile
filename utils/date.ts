const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'] as const;

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dow = DAYS_OF_WEEK[date.getDay()];
  return `${month}月${day}日 (${dow})`;
}

export function getToday(): string {
  const now = new Date();
  return toDateString(now);
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMonthDays(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(
      `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );
  }
  return days;
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function getWeekDates(baseDate: string): string[] {
  const date = new Date(baseDate + 'T00:00:00');
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toDateString(d));
  }
  return dates;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${remaining}分`;
}

export function getDayOfWeekShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return DAYS_OF_WEEK[date.getDay()];
}

export function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  return date.getFullYear() === year && date.getMonth() + 1 === month;
}
