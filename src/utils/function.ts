/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 14:06:14
 * @LastEditTime: 2025-04-03 14:46:02
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import { AnyObject } from "./object";
import _ from "lodash";
const co = require("co");

/**
 * The object obj prototype instance conversion to organize the data structure stored in the object,
 * access to this object in the v8 engine will be faster
 * @param {AnyObject} obj
 */
export function toFastProperties(obj: AnyObject) {
  // eslint-disable-next-line no-empty-function
  const f: any = function f() { };
  f.prototype = obj;
  // tslint:disable-next-line: no-unused-expression
  new f();
}

interface DeferObject {
  promise: Promise<any>;
  resolve: (res: any) => any;
  reject: (err: any) => any;
}

/**
 * Get promise deffer object
 *
 * @returns {*}  
 */
export function getDefer(): DeferObject {
  const defer: any = {};
  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}  
 */
export function safeRequire(file: string) {
  try {
    let obj = require(file);
    obj = (obj && obj.__esModule && obj.default) ? obj.default : obj;
    if (_.isFunction(obj)) {
      obj.prototype.__filename = file;
    }
    return obj;
  } catch (e) {
    throw Error(e);
  }
}


/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}  
 */
export const thinkrequire = safeRequire;


/**
 * Checks if value is a Promise object
 *
 * @export
 * @param {*} value
 * @returns {*}  {boolean}
 */
export function isPromise(value: any) {
  return !!(value && value.catch && typeof value.then === 'function');
}

/**
 * Convert callback-style functions to Promises
 *
 * @export
 * @param {Function} fn
 * @param {*} [receiver]
 * @returns {*}  
 */
export function promisify(fn: Function, receiver?: any) {
  return function (...args: any[]) {
    return new Promise(function (resolve, reject) {
      fn.apply(receiver, [...args, function (err: Error, res: any) {
        return err ? reject(err) : resolve(res);
      }]);
    });
  };
}

/**
 * Checks if fn is a GeneratorFunction
 *
 * @export
 * @param {*} fn
 * @returns {*}  {boolean}
 */
export function isGenerator(fn: any) {
  return !!(fn && typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction');
}

/**
 * Checks if value is a Async Function
 *
 * @export
 * @param {*} fn
 * @returns {*}  {boolean}
 */
export function isAsyncFunction(fn: any) {
  return !!(fn && typeof fn === 'function' && fn.constructor && 'AsyncFunction' === fn.constructor.name);
}

/**
 * Convert GeneratorFunction fn to Promise
 *
 * @export
 * @param {*} fn
 * @returns {*}  
 */
export function generatorToPromise(fn: any) {
  if (typeof fn !== 'function') {
    throw Error('fn is not a function');
  }
  if (!isGenerator(fn)) {
    // assume it's Promise-based
    return fn;
  }
  return co.wrap(fn);
}
