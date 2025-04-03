/**
 * 
 * @Description: Date time utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:51:55
 * @LastEditTime: 2025-04-03 10:52:37
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import lodash from "lodash";
import moment from "moment";

/**
 *
 *
 * @param {string} f
 * @returns {*}  
 */
const dateFn = function (f: string) {
  // let Week = ['日', '一', '二', '三', '四', '五', '六'];
  f = f.replace(/yyyy/, 'YYYY');
  f = f.replace(/yy/, 'YY');
  if (f.search(/^YY+.mm/) > -1) {
    f = f.replace(/mm/, 'MM');
  }
  f = f.replace(/mi|MI/, 'mm');
  // f = f.replace(/w|W/g, Week[d.getDay()]);
  f = f.replace(/dd/, 'DD');
  return f;
};

/**
 * Date time stamp and formatting
 *
 * @export
 * @param {(number | string | undefined)} date
 * @param {string} [format] defaults  'YYYY-MM-DD hh:mi:ss.SSS'
 * @param {number} [offset] defaults  8
 * @returns {(number | string)}
 */
export function dateTime(date?: number | string | undefined, format?: string, offset = 8): number | string {
  if (format === undefined) {
    //datetime() => now timestamp
    if (lodash.isString(date)) { //datetime('2017-01-01') => timestamp
      return Math.floor(new Date(date).getTime() / 1000);
    } else {
      return Math.floor(Date.now() / 1000);
    }
  } else {
    if (format) {
      format = dateFn(format);
    } else {
      format = 'YYYY-MM-DD HH:mm:ss.SSS';
    }

    if (date && lodash.isNumber(date)) {
  // 处理时间戳类型(秒或毫秒)
  if (date < 10000000000) { // 2025-04-09 14:13:20 的时间戳为 1743669600 (10位)
        return moment.unix(date).utcOffset(offset).format(format);
      } else {
        return moment(date).utcOffset(offset).format(format);
      }
    }
    if (date && lodash.isString(date)) {
      // 支持更多日期格式并保持时区一致性
      const formats = [
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        'YYYY/MM/DD HH:mm:ss',
        'YYYYMMDDHHmmss'
      ];
      // 明确指定输入为UTC时间并转换到目标时区
      const m = moment.utc(date, formats, true).utcOffset(offset);
      if (m.isValid()) {
        return m.format(format);
      }
      throw new Error(`Invalid date string: ${date}`);
    }
    return moment().utcOffset(offset).format(format);
  }
}
export const datetime = dateTime;

/**
 * Check if value is a Date object
 */
export function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
}

/**
 * Get timestamp in seconds
 */
export function timestamp() {
  const ts = Date.now();
  return Math.floor(ts / 1000);
}
