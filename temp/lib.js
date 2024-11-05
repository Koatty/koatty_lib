"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqual = exports.isDate = exports.arrUnique = exports.toString = exports.toObject = exports.toNumber = exports.toInteger = exports.toInt = exports.toArray = exports.isRegExp = exports.isUndefined = exports.isNull = exports.isNaN = exports.isSet = exports.isMap = exports.isSymbol = exports.isFunction = exports.isError = exports.isInteger = exports.isNumber = exports.isBuffer = exports.isString = exports.isBoolean = exports.isArrayBuffer = exports.isObject = exports.isArray = exports.lte = exports.lt = exports.gte = exports.gt = exports.eq = exports.sep = exports.thinkrequire = exports.datetime = void 0;
exports.toFastProperties = toFastProperties;
exports.isClass = isClass;
exports.isNumberString = isNumberString;
exports.isJSONObj = isJSONObj;
exports.isJSONStr = isJSONStr;
exports.isEmpty = isEmpty;
exports.isTrueEmpty = isTrueEmpty;
exports.escapeHtml = escapeHtml;
exports.escapeSpecial = escapeSpecial;
exports.ucFirst = ucFirst;
exports.md5 = md5;
exports.md5Salt = md5Salt;
exports.murmurHash = murmurHash;
exports.rand = rand;
exports.dateTime = dateTime;
exports.inArray = inArray;
exports.arrRemove = arrRemove;
exports.isFile = isFile;
exports.isDir = isDir;
exports.isWritable = isWritable;
exports.chmod = chmod;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.reFile = reFile;
exports.rmFile = rmFile;
exports.mkDir = mkDir;
exports.readDir = readDir;
exports.rmDir = rmDir;
exports.getDefer = getDefer;
exports.safeRequire = safeRequire;
exports.clone = clone;
exports.extend = extend;
exports.define = define;
exports.camelCase = camelCase;
exports.checkBoundary = checkBoundary;
exports.multi = multi;
exports.plus = plus;
exports.minus = minus;
exports.divide = divide;
exports.getDecimalLength = getDecimalLength;
exports.computeNumber = computeNumber;
exports.round = round;
exports.hasOwn = hasOwn;
exports.isPromise = isPromise;
exports.promisify = promisify;
exports.isGenerator = isGenerator;
exports.isAsyncFunction = isAsyncFunction;
exports.generatorToPromise = generatorToPromise;
const tslib_1 = require("tslib");
/*
 * @Author: richen
 * @Date: 2020-11-20 10:38:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-09 23:38:03
 * @License: BSD (3-Clause)
 * @Copyright (c) - <richenlin(at)gmail.com>
 */
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const murmurhash_1 = tslib_1.__importDefault(require("murmurhash"));
const co = require("co");
/**
 * The object obj prototype instance conversion to organize the data structure stored in the object,
 * access to this object in the v8 engine will be faster
 * @param {AnyObject} obj
 */
function toFastProperties(obj) {
    // eslint-disable-next-line no-empty-function
    const f = function f() { };
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
function isClass(func) {
    return typeof func === 'function'
        && /^class\s/.test(Function.prototype.toString.call(func));
}
/**
 * Checks if value is a string that contains only numbers
 *
 * @param {string} str
 * @returns {*}  {boolean}
 */
function isNumberString(str) {
    const numberReg = /^((-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;
    return lodash_1.default.isString(str) && !isEmpty(str) && numberReg.test(str);
}
/**
 * Checks if value is a standard JSON object,
 * must be a plain object or array
 *
 * @param {AnyObject} value
 * @returns {*}  {boolean}
 */
function isJSONObj(value) {
    return lodash_1.default.isPlainObject(value) || lodash_1.default.isArray(value);
}
/**
 * Checks if value is a standard JSON string,
 * must be a string, and can be deserialized as an plain object or array
 *
 * @param {string} value
 * @returns {*}  {boolean}
 */
function isJSONStr(value) {
    if (!lodash_1.default.isString(value)) {
        return false;
    }
    try {
        return isJSONObj(JSON.parse(value));
    }
    catch (e) {
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
function isEmpty(value) {
    if (value === undefined || value === null || value === '') {
        return true;
    }
    else if (lodash_1.default.isString(value)) {
        //\s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
        return value.replace(/(^\s*)|(\s*$)/g, '').length === 0;
    }
    else if (lodash_1.default.isNumber(value)) {
        return (0, exports.isNaN)(value);
    }
    else if (lodash_1.default.isArray(value)) {
        return value.length === 0;
    }
    else if (lodash_1.default.isPlainObject(value)) {
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
function isTrueEmpty(value) {
    if (value === undefined || value === null || value === '') {
        return true;
    }
    if (lodash_1.default.isNumber(value)) {
        return (0, exports.isNaN)(value);
    }
    return false;
}
/** @type {*} */
const htmlMaps = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quote;',
    '\'': '&#39;'
};
/** @type {*} */
const specialMaps = {
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
function escapeHtml(value) {
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
function escapeSpecial(value) {
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
function ucFirst(value) {
    value = lodash_1.default.toString(value || '');
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
/**
 * Calculate the MD5 hash of value
 *
 * @param {string} value
 * @returns {*}  {string}
 */
function md5(value) {
    const ins = crypto_1.default.createHash('md5');
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
function md5Salt(value, salt = 'abcdefghijklmnopqrstuvwxyz1234567890') {
    const ins = crypto_1.default.createHash('md5');
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
function murmurHash(value, seed = 97, ver = 2) {
    if (ver === 3) {
        return `${murmurhash_1.default.v3(value, seed)}`;
    }
    else {
        return `${murmurhash_1.default.v2(value, seed)}`;
    }
}
/**
 * Pseudo-random access min and max range of integers
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}  {number}
 */
function rand(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
/**
 *
 *
 * @param {string} f
 * @returns {*}
 */
const dateFn = function (f) {
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
function dateTime(date, format, offset = 8) {
    if (format === undefined) {
        //datetime() => now timestamp
        if (lodash_1.default.isString(date)) { //datetime('2017-01-01') => timestamp
            return Math.floor(new Date(date).getTime() / 1000);
        }
        else {
            return Math.floor(Date.now() / 1000);
        }
    }
    else {
        if (format) {
            format = dateFn(format);
        }
        else {
            format = 'YYYY-MM-DD HH:mm:ss.SSS';
        }
        if (date && lodash_1.default.isNumber(date)) {
            if (date < 10000000000) {
                return moment_1.default.unix(date).utcOffset(offset).format(format);
            }
            else {
                return (0, moment_1.default)(date).utcOffset(offset).format(format);
            }
        }
        if (date && lodash_1.default.isString(date)) {
            return (0, moment_1.default)(new Date(Date.parse(date))).utcOffset(offset).format(format);
        }
        return (0, moment_1.default)().utcOffset(offset).format(format);
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
function inArray(value, arr) {
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
function arrRemove(arr, index) {
    return lodash_1.default.remove(arr, function (n, i) {
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
function isFile(p) {
    try {
        const stats = fs_1.default.statSync(p);
        return stats.isFile();
    }
    catch (e) {
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
function isDir(p) {
    try {
        const stats = fs_1.default.statSync(p);
        return stats.isDirectory();
    }
    catch (e) {
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
function isWritable(p) {
    try {
        const stats = fs_1.default.statSync(p);
        const mode = stats.mode;
        const uid = process.getuid ? process.getuid() : 0;
        const gid = process.getgid ? process.getgid() : 0;
        const owner = uid === stats.uid;
        const group = gid === stats.gid;
        return !!(owner && (mode & parseInt('00200', 8)) ||
            group && (mode & parseInt('00020', 8)) ||
            (mode & parseInt('00002', 8)));
    }
    catch (e) {
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
function chmod(p, mode = '777') {
    return new Promise(function (fulfill, reject) {
        fs_1.default.stat(p, function (err, res) {
            if (err) {
                reject(err);
            }
            fs_1.default.chmod(p, mode, function (err) {
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
function readFile(filename, enc = 'utf8') {
    return new Promise(function (fulfill, reject) {
        fs_1.default.readFile(filename, enc, function (err, res) {
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
function writeFile(filename, data) {
    return new Promise(function (fulfill, reject) {
        fs_1.default.writeFile(filename, data, (err) => {
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
function reFile(fileName, newFileName) {
    return new Promise(function (fulfill, reject) {
        fs_1.default.rename(fileName, newFileName, function (err) {
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
function rmFile(p) {
    return new Promise(function (fulfill, reject) {
        fs_1.default.unlink(p, function (err) {
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
function mkDir(p, mode = '0777') {
    return new Promise(function (fulfill, reject) {
        fs_1.default.stat(path_1.default.dirname(p), function (err, res) {
            if (err || !res.isDirectory()) {
                reject(err);
            }
            fs_1.default.mkdir(p, { recursive: true, mode }, function (e) {
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
function readDir(p, filter, prefix = '') {
    filter = filter || function (x) {
        return x[0] !== '.';
    };
    const dir = path_1.default.join(p, prefix);
    return new Promise(function (fulfill, reject) {
        fs_1.default.stat(path_1.default.dirname(dir), function (err, res) {
            if (err || !res.isDirectory()) {
                reject(err);
            }
            fs_1.default.readdir(dir, 'utf-8', function (e, res) {
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
function rmDir(p, reserve) {
    return new Promise(function (fulfill, reject) {
        fs_1.default.rm(p, { maxRetries: 3, recursive: reserve }, function (err) {
            return err ? reject(err) : fulfill(null);
        });
    });
}
/**
 * Get promise deffer object
 *
 * @returns {*}
 */
function getDefer() {
    const defer = {};
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
function safeRequire(file) {
    try {
        let obj = require(file);
        obj = (obj && obj.__esModule && obj.default) ? obj.default : obj;
        if (lodash_1.default.isFunction(obj)) {
            obj.prototype.__filename = file;
        }
        return obj;
    }
    catch (e) {
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
function clone(source, deep = false) {
    if (deep) {
        return lodash_1.default.cloneDeep(source);
    }
    else {
        return lodash_1.default.clone(source);
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
function extend(source, target, deep = false) {
    if (deep) {
        return lodash_1.default.merge(lodash_1.default.cloneDeep(source), target);
    }
    else {
        return lodash_1.default.assignIn(source, target);
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
function define(obj, property, value, setter = false) {
    if (setter) {
        Object.defineProperty(obj, property, {
            value,
            writable: true,
            configurable: false,
            enumerable: true
        });
    }
    else {
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
function preserveCamelCase(str) {
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
        }
        else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
            str = str.slice(0, i - 1) + '-' + str.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        }
        else {
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
function camelCase(input, pascalCase = false) {
    if (!(typeof input === 'string' || Array.isArray(input))) {
        throw new TypeError('Expected the input to be `string | string[]`');
    }
    const postProcess = (x) => pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
    if (Array.isArray(input)) {
        input = input.map((x) => x.trim()).filter((x) => x.length).join('-');
    }
    else {
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
function checkBoundary(num) {
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
function multi(x, y) {
    return computeNumber(x, '*', y).result;
}
/**
 * Exact addition
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}
 */
function plus(x, y) {
    return computeNumber(x, '+', y).result;
}
/**
 * Exact subtraction
 *
 * @param {number} x
 * @param {number} y
 * @returns {*}
 */
function minus(x, y) {
    return computeNumber(x, '-', y).result;
}
/**
 * Exact division
 *
 * @param {number} num1
 * @param {number} num2
 * @returns {*}  {number}
 */
function divide(x, y) {
    return computeNumber(x, '/', y).result;
}
/**
     * 获取数字小数点的长度
     * @param {number} n 数字
     */
function getDecimalLength(n) {
    const decimal = n.toString().split('.')[1];
    return decimal ? decimal.length : 0;
}
function computeNumber(a, type, b) {
    // 防止越界
    checkBoundary(a);
    checkBoundary(b);
    /**
     * 修正小数点
     * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
     * @param {number} n
     */
    const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision));
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
        next(nextType, nextValue) {
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
function round(num, ratio) {
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
exports.datetime = dateTime;
/**
 * Support for es6 module require
 *
 * @param {string} file
 * @returns {*}
 */
exports.thinkrequire = safeRequire;
/**
 * Short for hasOwnProperty
 *
 * @export
 * @param {AnyObject} obj
 * @param {string} property
 * @returns {*}  {boolean}
 */
function hasOwn(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
/**
 * Checks if value is a Promise object
 *
 * @export
 * @param {*} value
 * @returns {*}  {boolean}
 */
function isPromise(value) {
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
function promisify(fn, receiver) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            fn.apply(receiver, [...args, function (err, res) {
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
function isGenerator(fn) {
    return !!(fn && typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction');
}
/**
 * Checks if value is a Async Function
 *
 * @export
 * @param {*} fn
 * @returns {*}  {boolean}
 */
function isAsyncFunction(fn) {
    return !!(fn && typeof fn === 'function' && fn.constructor && 'AsyncFunction' === fn.constructor.name);
}
/**
 * Convert GeneratorFunction fn to Promise
 *
 * @export
 * @param {*} fn
 * @returns {*}
 */
function generatorToPromise(fn) {
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
exports.sep = path_1.default.sep;
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
exports.eq = lodash_1.default.eq;
/**
 * Checks if value is greater than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than other, else false.
 */
exports.gt = lodash_1.default.gt;
/**
 * Checks if value is greater than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is greater than or equal to other, else false.
 */
exports.gte = lodash_1.default.gte;
/**
 * Checks if value is less than other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than other, else false.
 */
exports.lt = lodash_1.default.lt;
/**
 * Checks if value is less than or equal to other.
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @return Returns true if value is less than or equal to other, else false.
 */
exports.lte = lodash_1.default.lte;
/**
 * Checks if value is classified as an Array object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
exports.isArray = lodash_1.default.isArray;
/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a
 * [[Prototype]] of null.
 *
 * Note: This method assumes objects created by the Object constructor have no inherited enumerable properties.
 *
 * @param value The value to check.
 * @return Returns true if value is a plain object, else false.
 */
exports.isObject = lodash_1.default.isPlainObject;
/**
 * Checks if value is classified as an ArrayBuffer object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
exports.isArrayBuffer = lodash_1.default.isArrayBuffer;
/**
 * Checks if value is classified as a boolean primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
exports.isBoolean = lodash_1.default.isBoolean;
/**
 * Checks if value is classified as a String primitive or object.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
exports.isString = lodash_1.default.isString;
/**
 * Checks if value is a buffer.
 *
 * @param value The value to check.
 * @return Returns true if value is a buffer, else false.
 */
exports.isBuffer = lodash_1.default.isBuffer;
/**
 * Checks if value is classified as a Number primitive or object.
 *
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
exports.isNumber = lodash_1.default.isNumber;
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
exports.isInteger = lodash_1.default.isInteger;
/**
 * Checks if value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError
 * object.
 *
 * @param value The value to check.
 * @return Returns true if value is an error object, else false.
 */
exports.isError = lodash_1.default.isError;
/**
 * Checks if value is a callable function.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
exports.isFunction = lodash_1.default.isFunction;
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
exports.isSymbol = lodash_1.default.isSymbol;
/**
 * Checks if value is classified as a Map object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
exports.isMap = lodash_1.default.isMap;
/**
 * Checks if value is classified as a Set object.
 *
 * @param value The value to check.
 * @returns Returns true if value is correctly classified, else false.
 */
exports.isSet = lodash_1.default.isSet;
/**
 * Checks if value is NaN.
 *
 * Note: This method is not the same as isNaN which returns true for undefined and other non-numeric values.
 *
 * @param value The value to check.
 * @return Returns true if value is NaN, else false.
 */
exports.isNaN = lodash_1.default.isNaN;
/**
 * Checks if value is null.
 *
 * @param value The value to check.
 * @return Returns true if value is null, else false.
 */
exports.isNull = lodash_1.default.isNull;
/**
 * Checks if value is undefined.
 *
 * @param value The value to check.
 * @return Returns true if value is undefined, else false.
 */
exports.isUndefined = lodash_1.default.isUndefined;
/**
 * Checks if value is classified as a RegExp object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
exports.isRegExp = lodash_1.default.isRegExp;
/**
 * Converts value to an array.
 *
 * @param value The value to convert.
 * @return Returns the converted array.
 */
exports.toArray = lodash_1.default.toArray;
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
exports.toInt = lodash_1.default.toInteger;
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
exports.toInteger = lodash_1.default.toInteger;
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
exports.toNumber = lodash_1.default.toNumber;
/**
 * Converts value to a plain object flattening inherited enumerable properties of value to own properties
 * of the plain object.
 *
 * @param value The value to convert.
 * @return Returns the converted plain object.
 */
exports.toObject = lodash_1.default.toPlainObject;
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
exports.toString = lodash_1.default.toString;
/**
 * Creates an array of unique values, in order, from all of the provided arrays using SameValueZero for
 * equality comparisons.
 *
 * @param arrays The arrays to inspect.
 * @return Returns the new array of combined values.
 */
exports.arrUnique = lodash_1.default.union;
/**
 * Checks if value is classified as a Date object.
 * @param value The value to check.
 *
 * @return Returns true if value is correctly classified, else false.
 */
exports.isDate = lodash_1.default.isDate;
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
exports.isEqual = lodash_1.default.isEqual;
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
//# sourceMappingURL=lib.js.map