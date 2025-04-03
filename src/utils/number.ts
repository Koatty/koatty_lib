/**
 * 
 * @Description: Number utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:49:46
 * @LastEditTime: 2025-04-03 10:50:19
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

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
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  if (type === '/' && b === 0) {
    throw new Error('Division by zero');
  }
  checkBoundary(a);
  checkBoundary(b);
  
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case '+': result = (a + b) / power; break;
    case '-': result = (a - b) / power; break;
    case '*': result = (a * b) / (power * power); break;
    case '/': result = a / b; break;
  }

  return {
    result: amend(result),
    next(nextType: ComputeType, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    }
  };
}

function amend(n: number, precision = 15) {
  return parseFloat(n.toPrecision(precision));
}

function getDecimalLength(n: number) {
  const decimal = n.toString().split('.')[1];
  return decimal ? decimal.length : 0;
}
