/**
 * 
 * @Description: Date time utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:51:55
 * @LastEditTime: 2025-04-03 10:52:37
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

/**
 * Format date time string
 */
export function datetime(format = 'Y-m-d H:i:s', timestamp?: number) {
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return format
    .replace('Y', year.toString())
    .replace('m', month.toString().padStart(2, '0'))
    .replace('d', day.toString().padStart(2, '0'))
    .replace('H', hour.toString().padStart(2, '0'))
    .replace('i', minute.toString().padStart(2, '0'))
    .replace('s', second.toString().padStart(2, '0'));
}

/**
 * Check if value is a Date object
 */
export function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
}

/**
 * Get timestamp in seconds
 */
export function timestamp(seconds = false) {
  const ts = Date.now();
  return seconds ? Math.floor(ts / 1000) : ts;
}
