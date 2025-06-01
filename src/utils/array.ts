/**
 * 
 * @Description: Array utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:47:46
 * @LastEditTime: 2025-04-03 10:48:53
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import _ from 'lodash';

/**
 * Removes the specified index element from the array
 *
 * @param {T[]} arr - The array to modify
 * @param {number} index - The index to remove
 * @returns {T[]} The modified array
 */
export function arrRemove<T>(arr: T[], index: number): T[] {
  return _.remove(arr, (n, i) => i !== index);
}

/**
 * Creates an array of unique values
 */
export const arrUnique = _.union;

/**
 * Checks if value is an element of array (optimized implementation)
 *
 * @param {T} value - The value to search for
 * @param {T[]} arr - The array to search in
 * @returns {boolean} True if value is found in array
 */
export function inArray<T>(value: T, arr: T[]): boolean {
  return arr.includes(value);
}
