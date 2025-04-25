/**
 * @Description: Date time utility functions using date-fns
 * @Author: richen
 * @Date: 2025-04-03 10:51:55
 * @LastEditTime: 2025-04-03 10:52:37
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import { isValid, format as dateFnsFormat, getUnixTime, addHours } from 'date-fns';

/**
 * Convert moment-style format to date-fns format
 * @param format string
 * @returns string
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
    'a': 'a',
    'A': 'a'
  };

  return Object.entries(formatMap).reduce((result, [key, value]) => {
    return result.replace(new RegExp(key, 'g'), value);
  }, format);
};

/**
 * Parse various date formats
 * @param date string | number | Date
 * @param timeZoneOffset number
 * @returns Date
 */
const parseDate = (date: string | number | Date, timeZoneOffset = 8): Date => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === 'number') {
    if (date < 10000000000) {
      // 秒级时间戳 - 转换为毫秒级并应用时区偏移
      return new Date(date * 1000 + (timeZoneOffset * 60 * 60 * 1000));
    } else {
      // 毫秒级时间戳 - 直接应用时区偏移
      return new Date(date + (timeZoneOffset * 60 * 60 * 1000));
    }
  }

  if (typeof date === 'string') {
    // 处理日期字符串
    let parsedDate;

    // 检查是否为 ISO 格式 (带 Z 或 +/- 时区的)
    if (date.includes('Z') || date.match(/[+-]\d{2}:?\d{2}$/)) {
      parsedDate = new Date(date);
    } else {
      // 尝试解析其他格式
      const normalizedDate = date
        .replace(/[/]/g, '-')
        .replace(/[T]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      parsedDate = new Date(normalizedDate);
    }

    if (!isValid(parsedDate)) {
      throw new Error(`Invalid date string: ${date}`);
    }

    // 调整到目标时区
    return addHours(parsedDate, timeZoneOffset);
  }

  throw new Error('Invalid date input');
};

/**
 * Date time stamp and formatting
 * @param date number | string | undefined
 * @param format string
 * @param offset number
 * @returns number | string
 */
export function dateTime(
  date?: number | string | undefined,
  format?: string,
  offset = 8
): number | string {
  // Case 1: Return current timestamp
  if (format === undefined) {
    if (typeof date === 'string') {
      // Convert date string to timestamp
      const parsedDate = parseDate(date, offset);
      return getUnixTime(parsedDate);
    }
    return Math.floor(Date.now() / 1000);
  }

  // Case 2: Format date with specified format
  const defaultFormat = 'yyyy-MM-dd HH:mm:ss';
  const dateFormat = format ? convertFormat(format) : defaultFormat;

  try {
    let dateObj;
    if (typeof date === 'number') {
      // 处理时间戳 - 默认视为 UTC，转换为本地时间
      const timestamp = date < 10000000000 ? date * 1000 : date;
      const baseDate = new Date(timestamp);
      dateObj = addHours(baseDate, offset);
    } else if (date) {
      // 处理日期字符串 - 应用指定时区
      dateObj = parseDate(date, offset);
    } else {
      // 当前时间 - 应用指定时区
      dateObj = parseDate(new Date(), offset);
    }

    // 直接格式化，parseDate已处理时区
    return dateFnsFormat(dateObj, dateFormat);
  } catch (error) {
    throw new Error(`Failed to format date: ${error.message}`);
  }
}

export const datetime = dateTime;

/**
 * Check if value is a Date object
 */
export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Get timestamp in seconds
 */
export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}
