/*
 * @Author: richen
 * @Date: 2020-11-20 10:38:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-05 13:51:49
 * @License: BSD (3-Clause)
 * @Copyright (c) - <richenlin(at)gmail.com>
 */
import crypto from "crypto";
import fs from "fs";
import lodash from "lodash";
import moment from "moment";
import murmur from "murmurhash";
import path from "path";
const co = require("co");


// eslint-disable-next-line @typescript-eslint/no-empty-interface
type AnyObject = object;

interface DeferObject {
  promise: Promise<any>;
  resolve: (res: any) => any;
  reject: (err: any) => any;
}

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

/**
 * Checks if fn is a Class
 *
 * @param {AnyObject} obj
 * @returns {boolean}  
 */
export function isClass(func: AnyObject): boolean {
  return typeof func === 'function'
    && /^class\s/.test(Function.prototype.toString.call(func));
}

/**
 * Checks if value is a string that contains only numbers
 *
 * @param {string} str
 * @returns {*}  {boolean}
 */
export function isNumberString(str: string): boolean {
  const numberReg = /^((-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;
  return lodash.isString(str) && !isEmpty(str) && numberReg.test(str);
}

/**
 * Checks if value is a standard JSON object,
 * must be a plain object or array
 *
 * @param {AnyObject} value
 * @returns {*}  {boolean}
 */
export function isJSONObj(value: AnyObject): boolean {
  return lodash.isPlainObject(value) || lodash.isArray(value);
}

/**
 * Checks if value is a standard JSON string,
 * must be a string, and can be deserialized as an plain object or array
 *
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function isJSONStr(value: string): boolean {
  if (!lodash.isString(value)) {
    return false;
  }
  try {
    return isJSONObj(JSON.parse(value));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

/**
 * Checks value is empty,
 * undefined, null, '', NaN, [], {} and any empty string(including spaces, tabs, formfeeds, etc.), returns true
 *
 * @param {*} value
 * @returns {*}  {boolean}
 */
export function isEmpty(value: any): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  } else if (lodash.isString(value)) {
    //\s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
    return value.replace(/(^\s*)|(\s*$)/g, '').length === 0;
  } else if (lodash.isNumber(value)) {
    return isNaN(value);
  } else if (lodash.isArray(value)) {
    return value.length === 0;
  } else if (lodash.isPlainObject(value)) {
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
 * @param {*} value
 * @returns {*}  {boolean}
 */
export function isTrueEmpty(value: any): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  if (lodash.isNumber(value)) {
    return isNaN(value);
  }
  return false;
}

/** @type {*} */
const htmlMaps: any = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quote;',
  '\'': '&#39;'
};

/** @type {*} */
const specialMaps: any = {
  '&lt;': '<',
  '&gt;': '>',
  '&quote;': '"',
  '&#39;': '\''
};
/**
 * Convert special characters(> < " ') for entity character
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export function escapeHtml(value: string): string {
  return (`${value}`).replace(/[<>'"]/g, function (a) {
    return htmlMaps[a];
  });
}

/**
 * Convert entity value in value to(> < " ')
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export function escapeSpecial(value: string): string {
  // tslint:disable-next-line: forin
  for (const n in specialMaps) {
    value = value.replace(new RegExp(n, 'g'), specialMaps[n]);
  }
  return value;
}

/**
 * Convert the first letter in the value to uppercase
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export function ucFirst(value: string): string {
  value = lodash.toString(value || '');
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

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

/**
 * Pseudo-random access min and max range of integers
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}  {number}
 */
export function rand(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

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
      if (date < 10000000000) {
        return moment.unix(date).utcOffset(offset).format(format);
      } else {
        return moment(date).utcOffset(offset).format(format);
      }
    }
    if (date && lodash.isString(date)) {
      return moment(new Date(Date.parse(date))).utcOffset(offset).format(format);
    }
    return moment().utcOffset(offset).format(format);
  }
}

/**
 * Determines whether value is an element of array arr,
 * only determine the same value with the element, do not determine the type
 *
 * @param {*} value
 * @param {any[]} arr
 * @returns {*} {boolean}
 */
export function inArray(value: any, arr: any[]): boolean {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    // tslint:disable-next-line: triple-equals
    if (arr[i] == value) {
      return true;
    }
  }
  return false;
}

/**
 * Removes the specified index element from the array
 *
 * @param {any[]} arr
 * @param {number} index
 * @returns {*}  {any[]}
 */
export function arrRemove(arr: any[], index: number): any[] {
  return lodash.remove(arr, function (n, i) {
    return i !== index;
  });
}

/**
 * Checks if path is a file
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export function isFile(p: string): boolean {
  try {
    const stats = fs.statSync(p);
    return stats.isFile();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

/**
 * Checks if path is a dir
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export function isDir(p: string): boolean {
  try {
    const stats = fs.statSync(p);
    return stats.isDirectory();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

/**
 * Checks if the file or folder p is writable
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export function isWritable(p: string): boolean {
  try {
    const stats = fs.statSync(p);
    const mode = stats.mode;
    const uid = process.getuid ? process.getuid() : 0;
    const gid = process.getgid ? process.getgid() : 0;
    const owner = uid === stats.uid;
    const group = gid === stats.gid;
    return !!(owner && (mode & parseInt('00200', 8)) ||
      group && (mode & parseInt('00020', 8)) ||
      (mode & parseInt('00002', 8)));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

/**
 * Modify the permissions of the file or folder p.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {string} [mode='777']
 * @returns {*}  {Promise<any>}
 */
export function chmod(p: string, mode = '777'): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.stat(p, function (err, res) {
      if (err) {
        reject(err);
      }
      fs.chmod(p, mode, function (err) {
        return err ? reject(err) : fulfill(res);
      });
    });
  });
}

/**
 * Read the contents of the file filename.
 * Asynchronous mode
 *
 * @param {string} filename
 * @param {string} [enc='utf8']
 * @returns {*}  {Promise<any>}
 */
export function readFile(filename: string, enc: BufferEncoding = 'utf8'): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.readFile(filename, enc, function (err, res) {
      return err ? reject(err) : fulfill(res);
    });
  });
}

/**
 * Write the string data to file.
 * Asynchronous mode
 *
 * @param {string} filename
 * @param {(string | Buffer)} data
 * @returns {*}  {Promise<any>}
 */
export function writeFile(filename: string, data: string | Buffer): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.writeFile(filename, data, (err) => {
      return err ? reject(err) : fulfill(null);
    });
  });
}

/**
 * Rename the file. If newFileName and fileName be not in the same physical path, 
 * the move file action will be triggered.
 * Asynchronous mode
 *
 * @param {string} FileName
 * @param {string} newFileName
 * @returns {*}  {Promise<any>}
 */
export function reFile(fileName: string, newFileName: string): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.rename(fileName, newFileName, function (err) {
      return err ? reject(err) : fulfill(null);
    });
  });
}

/**
 * Delete the file p.
 * Asynchronous mode
 *
 * @param {string} p
 * @returns {*}  {Promise<any>}
 */
export function rmFile(p: string): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.unlink(p, function (err) {
      return err ? reject(err) : fulfill(null);
    });
  });
}

/**
 * According to the path p to create a folder, 
 * p contains multi-level new path will be automatically recursively created.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {string} [mode='0777']
 * @returns {Promise<any>}  
 */
export function mkDir(p: string, mode = '0777'): Promise<any> {
  return new Promise(function (fulfill, reject) {
    fs.stat(path.dirname(p), function (err, res) {
      if (err || !res.isDirectory()) {
        reject(err);
      }
      fs.mkdir(p, { recursive: true, mode }, function (e) {
        return e ? reject(e) : fulfill(null);
      });
    });
  });
}

/**
 * Recursively read the path under the p folder.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {*} filter
 * @param {string} [prefix='']
 * @returns {*}  {Promise<any>}
 */
export function readDir(p: string, filter: any, prefix = ''): Promise<any> {
  filter = filter || function (x: any) {
    return x[0] !== '.';
  };

  const dir = path.join(p, prefix);
  return new Promise(function (fulfill, reject) {
    fs.stat(path.dirname(dir), function (err, res) {
      if (err || !res.isDirectory()) {
        reject(err);
      }
      fs.readdir(dir, 'utf-8', function (e, res) {
        return e ? reject(e) : fulfill(res);
      });
    });
  });
}

/**
 * Subfolder of path p are recursively deleted. When reserve is true, the top-level folder is deleted
 * Asynchronous mode
 *
 * @param {string} p
 * @param {boolean} reserve
 * @returns {*}  
 */
export function rmDir(p: string, reserve: boolean) {
  return new Promise(function (fulfill, reject) {
    fs.rm(p, { maxRetries: 3, recursive: reserve }, function (err) {
      return err ? reject(err) : fulfill(null);
    });
  });
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
    if (lodash.isFunction(obj)) {
      obj.prototype.__filename = file;
    }
    return obj;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * Copy the source, deep deep to true depth copy
 *
 * @param {AnyObject} source
 * @param {boolean} [deep=false]
 * @returns {*} {AnyObject}
 */
export function clone(source: AnyObject, deep = false): AnyObject {
  if (deep) {
    return lodash.cloneDeep(source);
  } else {
    return lodash.clone(source);
  }
}

/**
 * So that the target object inherits the source, 
 * deep depth is true depth inheritance
 *
 * @param {AnyObject} source
 * @param {AnyObject} target
 * @param {boolean} [deep=false]
 * @returns {*}  {AnyObject}
 */
export function extend(source: AnyObject, target: AnyObject, deep = false): AnyObject {
  if (deep) {
    return lodash.merge(lodash.cloneDeep(source), target);
  } else {
    return lodash.assignIn(source, target);
  }
}

/**
 * Short for Object.defineProperty,
 * the property is getter when setter is false
 *
 * @param {AnyObject} obj
 * @param {string} property
 * @param {*} value
 * @param {boolean} [setter=false]
 * @returns {*}  
 */
export function define(obj: AnyObject, property: string, value: any, setter = false) {
  if (setter) {
    Object.defineProperty(obj, property, {
      value,
      writable: true,
      configurable: false,
      enumerable: true
    });
  } else {
    Object.defineProperty(obj, property, {
      // tslint:disable-next-line-literal-shorthand
      get() {
        return value;
      },
      configurable: false,
      enumerable: true
    });
  }
}

/**
 *
 *
 * @param {string} str
 * @returns {*}  
 */
function preserveCamelCase(str: string) {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < str.length; i++) {
    const character = str[i];

    if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
      str = str.slice(0, i) + '-' + str.slice(i);
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
      str = str.slice(0, i - 1) + '-' + str.slice(i - 1);
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
    }
  }

  return str;
}

/**
 * convert string to camelCase/pascalCase
 *
 * @param {string} input
 * @param {boolean} [pascalCase=false]
 * @returns {*}  
 */
export function camelCase(input: string, pascalCase = false) {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`');
  }

  const postProcess = (x: string) => pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
  if (Array.isArray(input)) {
    input = input.map((x) => x.trim()).filter((x) => x.length).join('-');
  } else {
    input = input.trim();
  }
  if (input.length === 0) {
    return '';
  }
  if (input.length === 1) {
    return pascalCase ? input.toUpperCase() : input.toLowerCase();
  }
  const hasUpperCase = input !== input.toLowerCase();
  if (hasUpperCase) {
    input = preserveCamelCase(input);
  }

  input = input.replace(/^[_.\- ]+/, '').toLowerCase().replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase()).replace(/\d+(\w|$)/g, (m) => m.toUpperCase());
  return postProcess(input);
}

/**
 * Check whether the number is out of range, and give a prompt if it is out of range
 * @param {*number} num 
 */
export function checkBoundary(num: number) {
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    throw Error(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
  }
}

/**
 * Exact multiplication
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}  {number}
 */
export function multi(x: number, y: number): number {
  return computeNumber(x, '*', y).result;
}

/**
 * Exact addition
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}  
 */
export function plus(x: number, y: number) {
  return computeNumber(x, '+', y).result;
}

/**
 * Exact subtraction
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}  
 */
export function minus(x: number, y: number) {
  return computeNumber(x, '-', y).result;
}

/**
 * Exact division
 *
 * @param {number} num1
 * @param {number} num2
 * @returns {*}  {number}
 */
export function divide(x: number, y: number): number {
  return computeNumber(x, '/', y).result;
}

/**
     * 获取数字小数点的长度
     * @param {number} n 数字
     */
export function getDecimalLength(n: number) {
  const decimal = n.toString().split('.')[1];
  return decimal ? decimal.length : 0;
}

/**
 * 数字运算（主要用于小数点精度问题）
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
type computeType = "+" | "-" | "*" | "/";
export function computeNumber(a: number, type: computeType, b: number) {
  // 防止越界
  checkBoundary(a);
  checkBoundary(b);
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param {number} n
   */
  const amend = (n: unknown, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case '+':
      result = (a + b) / power;
      break;
    case '-':
      result = (a - b) / power;
      break;
    case '*':
      result = (a * b) / (power * power);
      break;
    case '/':
      result = a / b;
      break;
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
       * 继续计算
       * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
       * @param {number} nextValue 继续计算的值
       */
    next(nextType: computeType, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    },
  };
}

/**
 * rounding
 *
 * @param {number} num
 * @param {number} ratio
 * @returns {*}  
 */
export function round(num: number, ratio: number) {
  const base = Math.pow(10, ratio);
  return divide(Math.round(multi(num, base)), base);
}
/**
 * Date time stamp and formatting
 *
 * @export
 * @param {(number | string | undefined)} date
 * @param {string} [format] defaults  'YYYY-MM-DD hh:mi:ss.SSS'
 * @param {number} [offset] defaults  8
 * @returns {(number | string)}
 */
export const datetime = dateTime;
/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}  
 */
export const thinkrequire = safeRequire;

/**
 * Short for hasOwnProperty
 *
 * @export
 * @param {AnyObject} obj
 * @param {string} property
 * @returns {*}  {boolean}
 */
export function hasOwn(obj: AnyObject, property: string) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

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

//--------------------------------------------------------------------//


/**
 * The platform-specific file separator. '\' or '/'.
 */
export const sep = path.sep;
/**
 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @category Lang
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
export const eq = lodash.eq;
/**
 * Checks if value is greater than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than other, else false.
 */
export const gt = lodash.gt;
/**
 * Checks if value is greater than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than or equal to other, else false.
 */
export const gte = lodash.gte;
/**
 * Checks if value is less than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than other, else false.
 */
export const lt = lodash.lt;
/**
 * Checks if value is less than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than or equal to other, else false.
 */
export const lte = lodash.lte;
/**
 * Checks if value is classified as an Array object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export const isArray = lodash.isArray;
/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a
 * [[Prototype]] of null.
 *
 * Note: This method assumes objects created by the Object constructor have no inherited enumerable properties.
 *
 * @param value The value to check.
 * @return Returns true if value is a plain object, else false.
 */
export const isObject = lodash.isPlainObject;
/**
 * Checks if value is classified as an ArrayBuffer object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export const isArrayBuffer = lodash.isArrayBuffer;
/**
 * Checks if value is classified as a boolean primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export const isBoolean = lodash.isBoolean;
/**
 * Checks if value is classified as a String primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export const isString = lodash.isString;
/**
 * Checks if value is a buffer.
 *
 * @param value The value to check.
 * @return Returns true if value is a buffer, else false.
 */
export const isBuffer = lodash.isBuffer;
/**
 * Checks if value is classified as a Number primitive or object.
 *
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export const isNumber = lodash.isNumber;
/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */
export const isInteger = lodash.isInteger;
/**
 * Checks if value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError
 * object.
 *
 * @param value The value to check.
 * @return Returns true if value is an error object, else false.
 */
export const isError = lodash.isError;
/**
 * Checks if value is a callable function.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export const isFunction = lodash.isFunction;
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
export const isSymbol = lodash.isSymbol;
/**
 * Checks if value is classified as a Map object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
export const isMap = lodash.isMap;
/**
 * Checks if value is classified as a Set object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
export const isSet = lodash.isSet;
/**
 * Checks if value is NaN.
 *
 * Note: This method is not the same as isNaN which returns true for undefined and other non-numeric values.
 *
 * @param value The value to check.
 * @return Returns true if value is NaN, else false.
 */
export const isNaN = lodash.isNaN;
/**
 * Checks if value is null.
 *
 * @param value The value to check.
 * @return Returns true if value is null, else false.
 */
export const isNull = lodash.isNull;
/**
 * Checks if value is undefined.
 *
 * @param value The value to check.
 * @return Returns true if value is undefined, else false.
 */
export const isUndefined = lodash.isUndefined;
/**
 * Checks if value is classified as a RegExp object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export const isRegExp = lodash.isRegExp;
/**
 * Converts value to an array.
 *
 * @param value The value to convert.
 * @return Returns the converted array.
 */
export const toArray = lodash.toArray;
/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @category Lang
 * @param value The value to convert.
 * @returns Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
export const toInt = lodash.toInteger;
/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @category Lang
 * @param value The value to convert.
 * @returns Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
export const toInteger = lodash.toInteger;
/**
 * Converts `value` to a number.
 *
 * @category Lang
 * @param value The value to process.
 * @returns Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
export const toNumber = lodash.toNumber;
/**
 * Converts value to a plain object flattening inherited enumerable properties of value to own properties
 * of the plain object.
 *
 * @param value The value to convert.
 * @return Returns the converted plain object.
 */
export const toObject = lodash.toPlainObject;
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` and `undefined` values. The sign of `-0` is preserved.
 *
 * @category Lang
 * @param value The value to process.
 * @returns Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
export const toString = lodash.toString;

/**
 * Creates an array of unique values, in order, from all of the provided arrays using SameValueZero for
 * equality comparisons.
 *
 * @param arrays The arrays to inspect.
 * @return Returns the new array of combined values.
 */
export const arrUnique = lodash.union;
/**
 * Checks if value is classified as a Date object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export const isDate = lodash.isDate;
/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are **not** supported.
 *
 * @category Lang
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
export const isEqual = lodash.isEqual;


// export default new Proxy({
//     eq: lodash.eq,
//     gt: lodash.gt,
//     gte: lodash.gte,

//     sep,
//     isObject,
//     isClass,
//     isJSONObj,
//     isJSONStr,
//     isNumberString,
//     isEmpty,
//     isTrueEmpty,
//     escapeHtml,
//     escapeSpecial,
//     ucFirst,
//     toFastProperties,
//     md5,
//     md5Salt,
//     murmurHash,
//     rand,
//     dateTime,
//     datetime: dateTime,
//     inArray,
//     arrRemove,
//     arrUnique: lodash.union,
//     isFile,
//     isDir,
//     isWritable,
//     chmod,
//     readFile,
//     writeFile,
//     reFile,
//     rmFile,
//     mkDir,
//     readDir,
//     rmDir,
//     getDefer,
//     safeRequire,
//     require: safeRequire,
//     clone,
//     extend,
//     define,
//     camelCase,
//     plus,
//     minus,
//     multi,
//     divide,
//     round,
// }, {
//     set(target, key, value, receiver) {
//         if (Reflect.get(target, key, receiver) === undefined) {
//             return Reflect.set(target, key, value, receiver);
//         } else {
//             throw Error('Cannot redefine getter-only property');
//         }
//     },
//     // eslint-disable-next-line no-unused-vars
//     deleteProperty(target, key) {
//         throw Error('Cannot delete getter-only property');
//     }
// });

