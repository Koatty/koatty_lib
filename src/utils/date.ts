/**
 * @Description: Date time utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:51:55
 * @LastEditTime: 2025-04-25 20:58:06
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import { isValid, getUnixTime, addHours } from 'date-fns';

/**
 * Convert moment-style format to standard format
 */
const convertFormat = (format: string): string => {
  const formatMap: { [key: string]: string } = {
    'YYYY': 'yyyy',
    'YY': 'yy',
    'MM': 'MM',
    'DD': 'dd',
    'HH': 'HH',
    'hh': 'hh',
    'mm': 'mm',
    'mi': 'mm',
    'MI': 'mm',
    'ss': 'ss',
    'SSS': 'SSS',
    'a': 'A',
    'A': 'A'
  };

  return Object.entries(formatMap).reduce((result, [key, value]) => {
    return result.replace(new RegExp(key, 'g'), value);
  }, format);
};

/**
 * Format UTC date to string
 */
const formatUTCDate = (date: Date, format: string): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = pad(date.getUTCMilliseconds());

  const hour12 = pad(parseInt(hours) % 12 || 12);
  const ampm = parseInt(hours) < 12 ? 'AM' : 'PM';

  let result = format
    .replace('yyyy', year.toString())
    .replace('yy', year.toString().slice(-2))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('hh', hour12)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds)
    .replace('a', ampm)
    .replace('A', ampm);

  // 处理时区偏移
  if (date instanceof Date && date.getTimezoneOffset() !== 0) {
    const offsetHours = Math.abs(Math.floor(date.getTimezoneOffset() / 60));
    const offsetMinutes = Math.abs(date.getTimezoneOffset() % 60);
    const offsetSign = date.getTimezoneOffset() > 0 ? '-' : '+';
    result = result.replace('Z', `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`);
  }

  return result;
};

/**
 * Parse date string with timezone support
 */
const parseDateString = (dateStr: string, offset?: number): Date => {
  if (dateStr.includes('Z') || dateStr.match(/[+-]\d{2}:?\d{2}$/)) {
    return new Date(dateStr);
  }

  const normalized = dateStr
    .replace(/\//g, '-')
    .replace('T', ' ')
    .trim();

  const date = new Date(normalized);
  if (!isValid(date)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  return offset ? addHours(date, offset) : date;
};

/**
 * Parse various date formats with timezone support
 */
const parseDate = (date: string | number | Date, offset?: number): Date => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === 'number') {
    const ms = date < 10000000000 ? date * 1000 : date;
    return new Date(ms);
  }

  return parseDateString(date, offset);
};

/**
 * Converts and formats date/time values
 * 
 * @param date - Unix timestamp, date string or undefined for current time
 * @param format - Output format string (optional)
 * @param offset - UTC offset in hours (optional)
 * @returns Number as unix timestamp or formatted date string
 * 
 * @example
 * ```ts
 * dateTime() // Returns current unix timestamp
 * dateTime('2023-01-01', 'YYYY-MM-DD') // Returns formatted date string
 * dateTime(1672531200, 'YYYY-MM-DD', 8) // Returns formatted date with UTC+8
 * ```
 */
export function dateTime(
  date?: number | string | undefined,
  format?: string,
  offset?: number
): number | string {
  if (!date && !format) {
    return Math.floor(Date.now() / 1000);
  }

  if (!format) {
    return getUnixTime(parseDate(date as string | number, offset));
  }

  try {
    let dateObj = date 
      ? parseDate(date, 0) // 先解析为UTC时间
      : new Date();
    
    // 应用时区偏移
    if (offset !== undefined) {
      dateObj = addHours(dateObj, offset);
    }
    
    return formatUTCDate(dateObj, convertFormat(format));
  } catch (error) {
    throw new Error(`Failed to format date: ${error.message}`);
  }
}

export const datetime = dateTime;

/**
 * Check if value is a valid Date object
 */
export function isDate(value: any): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Get current timestamp in seconds
 */
export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}
