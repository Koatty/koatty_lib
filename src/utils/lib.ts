/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 14:06:14
 * @LastEditTime: 2025-04-03 14:46:02
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import lodash from "lodash";

//--------------------------------------------------------------------//

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

