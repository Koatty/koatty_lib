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
export function define(obj: object, property: string, value: any, setter = false) {
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
export function hasOwn(obj: object, property: string) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * Checks if value is a plain object
 */
export const isObject = _.isPlainObject;

/**
 * Checks if value is a JSON object
 */
export function isJSONObj(value: any): boolean {
  return _.isPlainObject(value) || _.isArray(value);
}
