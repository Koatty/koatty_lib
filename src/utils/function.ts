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
import co from 'co';

/**
 * The object obj prototype instance conversion to organize the data structure stored in the object,
 * access to this object in the v8 engine will be faster
 * @param {AnyObject} obj
 */
export function toFastProperties(obj: AnyObject): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const f: any = function f() { };
  f.prototype = obj;
  // tslint:disable-next-line: no-unused-expression
  new f();
}

interface DeferObject<T = any> {
  promise: Promise<T>;
  resolve: (res: T) => void;
  reject: (err: any) => void;
}

/**
 * Get promise deffer object
 *
 * @returns {DeferObject<T>}
 */
export function getDefer<T = any>(): DeferObject<T> {
  const defer: any = {};
  defer.promise = new Promise<T>(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {any}
 */
export function safeRequire(file: string): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    let obj = require(file);
    obj = (obj && obj.__esModule && obj.default) ? obj.default : obj;
    if (_.isFunction(obj)) {
      obj.prototype.__filename = file;
    }
    return obj;
  } catch (error) {
    throw new Error(`Failed to require module "${file}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Support for es6 module require (alias for safeRequire)
 *
 * @param {string} file
 * @returns {any}
 */
export const thinkrequire = safeRequire;

/**
 * Checks if value is a Promise object
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPromise(value: unknown): value is Promise<any> {
  return !!(value && 
           typeof value === 'object' && 
           value !== null &&
           'then' in value && 
           typeof (value as any).then === 'function' &&
           'catch' in value &&
           typeof (value as any).catch === 'function');
}

/**
 * Convert callback-style functions to Promises
 *
 * @param {T} fn - The callback-style function to promisify  
 * @param {unknown} [receiver] - The receiver object for the function
 * @returns {(...args: Parameters<T>) => Promise<any>}
 */
export function promisify<T extends (...args: any[]) => void>(
  fn: T, 
  receiver?: unknown
): (...args: Parameters<T>) => Promise<any> {
  return function (...args: Parameters<T>): Promise<any> {
    return new Promise(function (resolve, reject) {
      fn.apply(receiver, [...args, function (err: Error | null, res?: any) {
        return err ? reject(err) : resolve(res);
      }]);
    });
  };
}

/**
 * Checks if fn is a GeneratorFunction
 *
 * @param {unknown} fn
 * @returns {boolean}
 */
export function isGenerator(fn: unknown): fn is GeneratorFunction {
  return !!(fn && typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction');
}

/**
 * Checks if value is a Async Function
 *
 * @param {unknown} fn
 * @returns {boolean}
 */
export function isAsyncFunction(fn: unknown): fn is (...args: any[]) => Promise<any> {
  return !!(fn && typeof fn === 'function' && fn.constructor && 'AsyncFunction' === fn.constructor.name);
}

/**
 * Convert GeneratorFunction fn to Promise
 *
 * @param {unknown} fn
 * @returns {(...args: any[]) => Promise<any>}
 */
export function generatorToPromise(fn: unknown): (...args: any[]) => Promise<any> {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function');
  }
  if (!isGenerator(fn)) {
    // assume it's Promise-based
    return fn as (...args: any[]) => Promise<any>;
  }
  return co.wrap(fn);
}
