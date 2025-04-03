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
 */
export function arrRemove(arr: any[], index: number): any[] {
  return _.remove(arr, (n, i) => i !== index);
}

/**
 * Creates an array of unique values
 */
export const arrUnique = _.union;

/**
 * Checks if value is an element of array (optimized implementation)
 */
export function inArray(value: any, arr: any[]): boolean {
  return arr.includes(value);
}

/**
 * Checks if value is an Array
 */
export const isArray = _.isArray;
