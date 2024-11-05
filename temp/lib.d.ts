import lodash from "lodash";
interface AnyObject extends Object {
}
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
export declare function toFastProperties(obj: AnyObject): void;
/**
 * Checks if fn is a Class
 *
 * @param {AnyObject} obj
 * @returns {boolean}
 */
export declare function isClass(func: AnyObject): boolean;
/**
 * Checks if value is a string that contains only numbers
 *
 * @param {string} str
 * @returns {*}  {boolean}
 */
export declare function isNumberString(str: string): boolean;
/**
 * Checks if value is a standard JSON object,
 * must be a plain object or array
 *
 * @param {AnyObject} value
 * @returns {*}  {boolean}
 */
export declare function isJSONObj(value: AnyObject): boolean;
/**
 * Checks if value is a standard JSON string,
 * must be a string, and can be deserialized as an plain object or array
 *
 * @param {string} value
 * @returns {*}  {boolean}
 */
export declare function isJSONStr(value: string): boolean;
/**
 * Checks value is empty,
 * undefined, null, '', NaN, [], {} and any empty string(including spaces, tabs, formfeeds, etc.), returns true
 *
 * @param {*} value
 * @returns {*}  {boolean}
 */
export declare function isEmpty(value: any): boolean;
/**
 * Checks value is empty,
 * do not consider empty objects, empty arrays, spaces, tabs, form breaks, etc.
 *
 * @param {*} value
 * @returns {*}  {boolean}
 */
export declare function isTrueEmpty(value: any): boolean;
/**
 * Convert special characters(> < " ') for entity character
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export declare function escapeHtml(value: string): string;
/**
 * Convert entity value in value to(> < " ')
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export declare function escapeSpecial(value: string): string;
/**
 * Convert the first letter in the value to uppercase
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export declare function ucFirst(value: string): string;
/**
 * Calculate the MD5 hash of value
 *
 * @param {string} value
 * @returns {*}  {string}
 */
export declare function md5(value: string): string;
/**
 * Calculate the value of MD5 hash value, including simple salt
 *
 * @param {string} value
 * @param {string} [salt='abcdefghijklmnopqrstuvwxyz1234567890']
 * @returns {*}  {string}
 */
export declare function md5Salt(value: string, salt?: string): string;
/**
 * Murmur hash v2/v3
 *
 * @param {string} value
 * @param {number} [seed=97]
 * @param {number} [ver=2]
 * @returns {*}  {string}
 */
export declare function murmurHash(value: string, seed?: number, ver?: number): string;
/**
 * Pseudo-random access min and max range of integers
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}  {number}
 */
export declare function rand(min: number, max: number): number;
/**
 * Date time stamp and formatting
 *
 * @export
 * @param {(number | string | undefined)} date
 * @param {string} [format] defaults  'YYYY-MM-DD hh:mi:ss.SSS'
 * @param {number} [offset] defaults  8
 * @returns {(number | string)}
 */
export declare function dateTime(date?: number | string | undefined, format?: string, offset?: number): number | string;
/**
 * Determines whether value is an element of array arr,
 * only determine the same value with the element, do not determine the type
 *
 * @param {*} value
 * @param {any[]} arr
 * @returns {*} {boolean}
 */
export declare function inArray(value: any, arr: any[]): boolean;
/**
 * Removes the specified index element from the array
 *
 * @param {any[]} arr
 * @param {number} index
 * @returns {*}  {any[]}
 */
export declare function arrRemove(arr: any[], index: number): any[];
/**
 * Checks if path is a file
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export declare function isFile(p: string): boolean;
/**
 * Checks if path is a dir
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export declare function isDir(p: string): boolean;
/**
 * Checks if the file or folder p is writable
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export declare function isWritable(p: string): boolean;
/**
 * Modify the permissions of the file or folder p.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {string} [mode='777']
 * @returns {*}  {Promise<any>}
 */
export declare function chmod(p: string, mode?: string): Promise<any>;
/**
 * Read the contents of the file filename.
 * Asynchronous mode
 *
 * @param {string} filename
 * @param {string} [enc='utf8']
 * @returns {*}  {Promise<any>}
 */
export declare function readFile(filename: string, enc?: BufferEncoding): Promise<any>;
/**
 * Write the string data to file.
 * Asynchronous mode
 *
 * @param {string} filename
 * @param {(string | Buffer)} data
 * @returns {*}  {Promise<any>}
 */
export declare function writeFile(filename: string, data: string | Buffer): Promise<any>;
/**
 * Rename the file. If newFileName and fileName be not in the same physical path,
 * the move file action will be triggered.
 * Asynchronous mode
 *
 * @param {string} FileName
 * @param {string} newFileName
 * @returns {*}  {Promise<any>}
 */
export declare function reFile(fileName: string, newFileName: string): Promise<any>;
/**
 * Delete the file p.
 * Asynchronous mode
 *
 * @param {string} p
 * @returns {*}  {Promise<any>}
 */
export declare function rmFile(p: string): Promise<any>;
/**
 * According to the path p to create a folder,
 * p contains multi-level new path will be automatically recursively created.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {string} [mode='0777']
 * @returns {Promise<any>}
 */
export declare function mkDir(p: string, mode?: string): Promise<any>;
/**
 * Recursively read the path under the p folder.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {*} filter
 * @param {string} [prefix='']
 * @returns {*}  {Promise<any>}
 */
export declare function readDir(p: string, filter: any, prefix?: string): Promise<any>;
/**
 * Subfolder of path p are recursively deleted. When reserve is true, the top-level folder is deleted
 * Asynchronous mode
 *
 * @param {string} p
 * @param {boolean} reserve
 * @returns {*}
 */
export declare function rmDir(p: string, reserve: boolean): Promise<unknown>;
/**
 * Get promise deffer object
 *
 * @returns {*}
 */
export declare function getDefer(): DeferObject;
/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}
 */
export declare function safeRequire(file: string): any;
/**
 * Copy the source, deep deep to true depth copy
 *
 * @param {AnyObject} source
 * @param {boolean} [deep=false]
 * @returns {*} {AnyObject}
 */
export declare function clone(source: AnyObject, deep?: boolean): AnyObject;
/**
 * So that the target object inherits the source,
 * deep depth is true depth inheritance
 *
 * @param {AnyObject} source
 * @param {AnyObject} target
 * @param {boolean} [deep=false]
 * @returns {*}  {AnyObject}
 */
export declare function extend(source: AnyObject, target: AnyObject, deep?: boolean): AnyObject;
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
export declare function define(obj: AnyObject, property: string, value: any, setter?: boolean): void;
/**
 * convert string to camelCase/pascalCase
 *
 * @param {string} input
 * @param {boolean} [pascalCase=false]
 * @returns {*}
 */
export declare function camelCase(input: string, pascalCase?: boolean): string;
/**
 * Check whether the number is out of range, and give a prompt if it is out of range
 * @param {*number} num
 */
export declare function checkBoundary(num: number): void;
/**
 * Exact multiplication
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}  {number}
 */
export declare function multi(x: number, y: number): number;
/**
 * Exact addition
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}
 */
export declare function plus(x: number, y: number): number;
/**
 * Exact subtraction
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}
 */
export declare function minus(x: number, y: number): number;
/**
 * Exact division
 *
 * @param {number} num1
 * @param {number} num2
 * @returns {*}  {number}
 */
export declare function divide(x: number, y: number): number;
/**
     * 获取数字小数点的长度
     * @param {number} n 数字
     */
export declare function getDecimalLength(n: number): number;
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
export declare function computeNumber(a: number, type: computeType, b: number): {
    /** 计算结果 */
    result: number;
    /**
       * 继续计算
       * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
       * @param {number} nextValue 继续计算的值
       */
    next(nextType: computeType, nextValue: number): any;
};
/**
 * rounding
 *
 * @param {number} num
 * @param {number} ratio
 * @returns {*}
 */
export declare function round(num: number, ratio: number): number;
/**
 * Date time stamp and formatting
 *
 * @export
 * @param {(number | string | undefined)} date
 * @param {string} [format] defaults  'YYYY-MM-DD hh:mi:ss.SSS'
 * @param {number} [offset] defaults  8
 * @returns {(number | string)}
 */
export declare const datetime: typeof dateTime;
/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}
 */
export declare const thinkrequire: typeof safeRequire;
/**
 * Short for hasOwnProperty
 *
 * @export
 * @param {AnyObject} obj
 * @param {string} property
 * @returns {*}  {boolean}
 */
export declare function hasOwn(obj: AnyObject, property: string): any;
/**
 * Checks if value is a Promise object
 *
 * @export
 * @param {*} value
 * @returns {*}  {boolean}
 */
export declare function isPromise(value: any): boolean;
/**
 * Convert callback-style functions to Promises
 *
 * @export
 * @param {Function} fn
 * @param {*} [receiver]
 * @returns {*}
 */
export declare function promisify(fn: Function, receiver?: any): (...args: any[]) => Promise<unknown>;
/**
 * Checks if fn is a GeneratorFunction
 *
 * @export
 * @param {*} fn
 * @returns {*}  {boolean}
 */
export declare function isGenerator(fn: any): boolean;
/**
 * Checks if value is a Async Function
 *
 * @export
 * @param {*} fn
 * @returns {*}  {boolean}
 */
export declare function isAsyncFunction(fn: any): boolean;
/**
 * Convert GeneratorFunction fn to Promise
 *
 * @export
 * @param {*} fn
 * @returns {*}
 */
export declare function generatorToPromise(fn: any): any;
/**
 * The platform-specific file separator. '\' or '/'.
 */
export declare const sep: "/" | "\\";
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
export declare const eq: (value: any, other: any) => boolean;
/**
 * Checks if value is greater than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than other, else false.
 */
export declare const gt: (value: any, other: any) => boolean;
/**
 * Checks if value is greater than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than or equal to other, else false.
 */
export declare const gte: (value: any, other: any) => boolean;
/**
 * Checks if value is less than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than other, else false.
 */
export declare const lt: (value: any, other: any) => boolean;
/**
 * Checks if value is less than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than or equal to other, else false.
 */
export declare const lte: (value: any, other: any) => boolean;
/**
 * Checks if value is classified as an Array object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isArray: {
    (value?: any): value is any[];
    <T>(value?: any): value is any[];
};
/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a
 * [[Prototype]] of null.
 *
 * Note: This method assumes objects created by the Object constructor have no inherited enumerable properties.
 *
 * @param value The value to check.
 * @return Returns true if value is a plain object, else false.
 */
export declare const isObject: (value?: any) => boolean;
/**
 * Checks if value is classified as an ArrayBuffer object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isArrayBuffer: (value?: any) => value is ArrayBuffer;
/**
 * Checks if value is classified as a boolean primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isBoolean: (value?: any) => value is boolean;
/**
 * Checks if value is classified as a String primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isString: (value?: any) => value is string;
/**
 * Checks if value is a buffer.
 *
 * @param value The value to check.
 * @return Returns true if value is a buffer, else false.
 */
export declare const isBuffer: (value?: any) => boolean;
/**
 * Checks if value is classified as a Number primitive or object.
 *
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isNumber: (value?: any) => value is number;
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
export declare const isInteger: (value?: any) => boolean;
/**
 * Checks if value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError
 * object.
 *
 * @param value The value to check.
 * @return Returns true if value is an error object, else false.
 */
export declare const isError: (value: any) => value is Error;
/**
 * Checks if value is a callable function.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isFunction: (value: any) => value is (...args: any[]) => any;
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
export declare const isSymbol: (value: any) => value is symbol;
/**
 * Checks if value is classified as a Map object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
export declare const isMap: (value?: any) => value is Map<any, any>;
/**
 * Checks if value is classified as a Set object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
export declare const isSet: (value?: any) => value is Set<any>;
/**
 * Checks if value is NaN.
 *
 * Note: This method is not the same as isNaN which returns true for undefined and other non-numeric values.
 *
 * @param value The value to check.
 * @return Returns true if value is NaN, else false.
 */
export declare const isNaN: (value?: any) => boolean;
/**
 * Checks if value is null.
 *
 * @param value The value to check.
 * @return Returns true if value is null, else false.
 */
export declare const isNull: (value: any) => value is null;
/**
 * Checks if value is undefined.
 *
 * @param value The value to check.
 * @return Returns true if value is undefined, else false.
 */
export declare const isUndefined: (value: any) => value is undefined;
/**
 * Checks if value is classified as a RegExp object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isRegExp: (value?: any) => value is RegExp;
/**
 * Converts value to an array.
 *
 * @param value The value to convert.
 * @return Returns the converted array.
 */
export declare const toArray: {
    <T>(value: lodash.Dictionary<T> | lodash.NumericDictionary<T> | null | undefined): T[];
    <T>(value: T): Array<T[keyof T]>;
    (): any[];
};
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
export declare const toInt: (value: any) => number;
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
export declare const toInteger: (value: any) => number;
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
export declare const toNumber: (value: any) => number;
/**
 * Converts value to a plain object flattening inherited enumerable properties of value to own properties
 * of the plain object.
 *
 * @param value The value to convert.
 * @return Returns the converted plain object.
 */
export declare const toObject: (value?: any) => any;
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
export declare const toString: (value: any) => string;
/**
 * Creates an array of unique values, in order, from all of the provided arrays using SameValueZero for
 * equality comparisons.
 *
 * @param arrays The arrays to inspect.
 * @return Returns the new array of combined values.
 */
export declare const arrUnique: <T>(...arrays: Array<lodash.List<T> | null | undefined>) => T[];
/**
 * Checks if value is classified as a Date object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
export declare const isDate: (value?: any) => value is Date;
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
export declare const isEqual: (value: any, other: any) => boolean;
export {};
//# sourceMappingURL=lib.d.ts.map