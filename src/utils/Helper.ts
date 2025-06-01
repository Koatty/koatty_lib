/**
 * 
 * @Description: Helper namespace for all utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:53:27
 * @LastEditTime: 2025-04-03 10:53:38
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
// import _ from 'lodash';

export * from './array';
export * from './crypto';
export * from './date';
export * from './file';
export * from './function';
export * from './number';
export * from './object';
export * from './string';

export {
  eq,
  isEqual,
  gt,
  gte,
  lt,
  lte,
  isArray,
  isDate,
  isArrayBuffer,
  isBoolean,
  isString,
  isBuffer,
  isNumber,
  isInteger,
  isObject,
  isError,
  isFunction,
  isSymbol,
  isSet,
  isMap,
  isNaN,
  isUndefined,
  isNull,
  isRegExp,
  toArray,
  toInteger as toInt,
  toInteger,
  toNumber,
  toPlainObject as toObject,
  toString
} from "lodash";

