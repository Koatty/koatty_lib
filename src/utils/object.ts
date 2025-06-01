/**
 * 
 * @Description: Object utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:49:10
 * @LastEditTime: 2025-04-03 10:49:33
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import _ from 'lodash';

export interface AnyObject {
  [key: string]: any;
  [key: number]: any;
}

/**
 * Creates a shallow or deep clone of the source object
 */
export function clone<T extends object>(source: T, deep = false): T {
  return deep ? _.cloneDeep(source) : _.clone(source);
}

/**
 * Extends target object with source properties
 */
export function extend<T extends object, U extends object>(
  source: T,
  target: U, 
  deep = false
): T & U {
  return deep ? _.merge(_.cloneDeep(source), target) : _.assignIn(source, target);
}

/**
 * Define object property
 */
export function define(obj: object, property: string, value: any, setter = false): void {
  Object.defineProperty(obj, property, setter ? {
    value,
    writable: true,
    configurable: false,
    enumerable: true
  } : {
    get() { return value; },
    configurable: false,
    enumerable: true
  });
}

/**
 * Checks if object has own property
 */
export function hasOwn(obj: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a
 * [[Prototype]] of null.
 *
 * Note: This method assumes objects created by the Object constructor have no inherited enumerable properties.
 *
 * @param value The value to check.
 * @return Returns true if value is a plain object, else false.
 */
export const isObject = _.isPlainObject;

/**
 * Checks if value is a JSON object
 */
export function isJSONObj(value: unknown): value is object | any[] {
  return _.isPlainObject(value) || _.isArray(value);
}

/**
 * Checks if fn is a Class
 *
 * @param {unknown} func
 * @returns {boolean}  
 */
export function isClass(func: unknown): func is new (...args: any[]) => any {
  return typeof func === 'function'
    && /^class\s/.test(Function.prototype.toString.call(func));
}

/**
 * Checks value is empty,
 * undefined, null, '', NaN, [], {} and any empty string(including spaces, tabs, formfeeds, etc.), returns true
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  } else if (_.isString(value)) {
    //\s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
    return value.replace(/(^\s*)|(\s*$)/g, '').length === 0;
  } else if (_.isNumber(value)) {
    return isNaN(value);
  } else if (_.isArray(value)) {
    return value.length === 0;
  } else if (_.isPlainObject(value)) {
    // for (let key in value) {
    //     return !key && !0;
    // }
    // return true;
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Checks value is empty,
 * do not consider empty objects, empty arrays, spaces, tabs, form breaks, etc.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isTrueEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  if (_.isNumber(value)) {
    return isNaN(value);
  }
  return false;
}