import { describe, it, expect } from '@jest/globals';
import {
  formatDate,
  toDateString,
  getMonthDays,
  getFirstDayOfWeek,
  getWeekDates,
  formatDuration,
  getDayOfWeekShort,
  isSameMonth,
} from './date';

describe('formatDate', () => {
  it('formats date string to Japanese format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('1月15日 (月)');
  });

  it('formats date on Sunday', () => {
    const result = formatDate('2024-01-14');
    expect(result).toBe('1月14日 (日)');
  });

  it('formats date on Saturday', () => {
    const result = formatDate('2024-01-20');
    expect(result).toBe('1月20日 (土)');
  });
});

describe('toDateString', () => {
  it('converts Date object to YYYY-MM-DD string', () => {
    const date = new Date(2024, 0, 5);
    expect(toDateString(date)).toBe('2024-01-05');
  });

  it('pads single digit months and days', () => {
    const date = new Date(2024, 2, 3);
    expect(toDateString(date)).toBe('2024-03-03');
  });

  it('handles December', () => {
    const date = new Date(2024, 11, 25);
    expect(toDateString(date)).toBe('2024-12-25');
  });
});

describe('getMonthDays', () => {
  it('returns all days in January (31 days)', () => {
    const days = getMonthDays(2024, 1);
    expect(days).toHaveLength(31);
    expect(days[0]).toBe('2024-01-01');
    expect(days[30]).toBe('2024-01-31');
  });

  it('returns 29 days for February in a leap year', () => {
    const days = getMonthDays(2024, 2);
    expect(days).toHaveLength(29);
    expect(days[28]).toBe('2024-02-29');
  });

  it('returns 28 days for February in a non-leap year', () => {
    const days = getMonthDays(2023, 2);
    expect(days).toHaveLength(28);
  });

  it('returns 30 days for April', () => {
    const days = getMonthDays(2024, 4);
    expect(days).toHaveLength(30);
  });

  it('formats day strings with zero-padding', () => {
    const days = getMonthDays(2024, 3);
    expect(days[0]).toBe('2024-03-01');
    expect(days[8]).toBe('2024-03-09');
    expect(days[9]).toBe('2024-03-10');
  });
});

describe('getFirstDayOfWeek', () => {
  it('returns 1 for January 2024 (starts on Monday)', () => {
    expect(getFirstDayOfWeek(2024, 1)).toBe(1);
  });

  it('returns 0 for September 2024 (starts on Sunday)', () => {
    expect(getFirstDayOfWeek(2024, 9)).toBe(0);
  });

  it('returns 4 for February 2024 (starts on Thursday)', () => {
    expect(getFirstDayOfWeek(2024, 2)).toBe(4);
  });
});

describe('getWeekDates', () => {
  it('returns 7 dates starting from Monday', () => {
    const dates = getWeekDates('2024-01-17');
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2024-01-15');
    expect(dates[6]).toBe('2024-01-21');
  });

  it('handles Monday as base date', () => {
    const dates = getWeekDates('2024-01-15');
    expect(dates[0]).toBe('2024-01-15');
    expect(dates[6]).toBe('2024-01-21');
  });

  it('handles Sunday as base date', () => {
    const dates = getWeekDates('2024-01-21');
    expect(dates[0]).toBe('2024-01-15');
    expect(dates[6]).toBe('2024-01-21');
  });

  it('handles week crossing month boundary', () => {
    const dates = getWeekDates('2024-01-31');
    expect(dates[0]).toBe('2024-01-29');
    expect(dates[6]).toBe('2024-02-04');
  });
});

describe('formatDuration', () => {
  it('formats minutes under 60', () => {
    expect(formatDuration(30)).toBe('30分');
    expect(formatDuration(1)).toBe('1分');
    expect(formatDuration(59)).toBe('59分');
  });

  it('formats exact hours', () => {
    expect(formatDuration(60)).toBe('1時間');
    expect(formatDuration(120)).toBe('2時間');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1時間30分');
    expect(formatDuration(150)).toBe('2時間30分');
    expect(formatDuration(61)).toBe('1時間1分');
  });

  it('formats zero minutes', () => {
    expect(formatDuration(0)).toBe('0分');
  });
});

describe('getDayOfWeekShort', () => {
  it('returns Japanese day of week abbreviation', () => {
    expect(getDayOfWeekShort('2024-01-15')).toBe('月');
    expect(getDayOfWeekShort('2024-01-14')).toBe('日');
    expect(getDayOfWeekShort('2024-01-20')).toBe('土');
    expect(getDayOfWeekShort('2024-01-16')).toBe('火');
  });
});

describe('isSameMonth', () => {
  it('returns true for matching year and month', () => {
    expect(isSameMonth('2024-01-15', 2024, 1)).toBe(true);
    expect(isSameMonth('2024-12-01', 2024, 12)).toBe(true);
  });

  it('returns false for different month', () => {
    expect(isSameMonth('2024-01-15', 2024, 2)).toBe(false);
  });

  it('returns false for different year', () => {
    expect(isSameMonth('2024-01-15', 2023, 1)).toBe(false);
  });
});
