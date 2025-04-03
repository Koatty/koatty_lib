/**
 * 
 * @Description: Number utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:49:46
 * @LastEditTime: 2025-04-03 10:50:19
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import _ from "lodash";
import { isEmpty } from "./object";

/**
 * Exact multiplication
 */
export function multi(x: number, y: number): number {
  return computeNumber(x, '*', y).result;
}

/**
 * Exact addition
 */
export function plus(x: number, y: number) {
  return computeNumber(x, '+', y).result;
}

/**
 * Exact subtraction
 */
export function minus(x: number, y: number) {
  return computeNumber(x, '-', y).result;
}

/**
 * Exact division
 */
export function divide(x: number, y: number): number {
  return computeNumber(x, '/', y).result;
}

/**
 * Rounding
 */
export function round(num: number, ratio: number) {
  const base = Math.pow(10, ratio);
  return divide(Math.round(multi(num, base)), base);
}

/**
 * Check if number is within safe integer boundary
 * @param {number} num - Number to check
 * @throws {RangeError} If number exceeds safe integer range
 * @example
 * checkBoundary(Number.MAX_SAFE_INTEGER + 1); // throws RangeError
 */
export function checkBoundary(num: number) {
  if (isNaN(num)) {
    throw new Error("Is not a number");
  }
  
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(`Number ${num} exceeds safe integer boundary (${Number.MIN_SAFE_INTEGER}, ${Number.MAX_SAFE_INTEGER})`);
  }
}

type ComputeType = "+" | "-" | "*" | "/";

/**
 * Perform precise arithmetic operations to avoid floating point errors
 * @param {number} a - First operand
 * @param {ComputeType} type - Arithmetic operation type (+, -, *, /)
 * @param {number} b - Second operand 
 * @returns {Object} Result with next() method for chaining
 * @throws {TypeError} If arguments are invalid
 * @throws {RangeError} If numbers exceed safe integer range
 * @throws {Error} If division by zero occurs
 * @example 
 * computeNumber(0.1, '+', 0.2).result // 0.3
 * computeNumber(0.1, '+', 0.2).next('*', 10).result // 3
 */
export function computeNumber(a: number, type: ComputeType, b: number) {
  // 防止越界
  checkBoundary(a);
  checkBoundary(b);
  if (b === 0 && type === '/') {
    throw new Error("Division by zero");
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param {number} n
   */
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
    next(nextType: ComputeType, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    },
  };
}

/**
 * Checks if value is a string that contains only numbers
 *
 * @param {string} str
 * @returns {*}  {boolean}
 */
export function isNumberString(str: string): boolean {
  const numberReg = /^((-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;
  return _.isString(str) && !isEmpty(str) && numberReg.test(str);
}

function amend(n: number, precision = 15) {
  return parseFloat(n.toPrecision(precision));
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
 * Pseudo-random access min and max range of integers
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}  {number}
 */
export function rand(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}