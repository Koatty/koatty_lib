/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 14:12:11
 * @LastEditTime: 2025-04-03 14:12:32
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import crypto from "crypto";
import murmur from "murmurhash";

/**
 * Calculate the MD5 hash of value
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export function md5(value: string): string {
  const ins = crypto.createHash('md5');
  ins.update(value);
  return ins.digest('hex');
}

/**
 * Calculate the value of MD5 hash value, including simple salt
 *
 * @param {string} value
 * @param {string} [salt='abcdefghijklmnopqrstuvwxyz1234567890']
 * @returns {*}  {string}
 */
export function md5Salt(value: string, salt = 'abcdefghijklmnopqrstuvwxyz1234567890'): string {
  const ins = crypto.createHash('md5');
  value = value + salt.slice(value.length % salt.length, salt.length);
  ins.update(value);
  return ins.digest('hex');
}

/**
 * Murmur hash v2/v3
 *
 * @param {string} value
 * @param {number} [seed=97]
 * @param {number} [ver=2]
 * @returns {*}  {string}
 */
export function murmurHash(value: string, seed = 97, ver = 2): string {
  if (ver === 3) {
    return `${murmur.v3(value, seed)}`;
  } else {
    return `${murmur.v2(value, seed)}`;
  }
}
