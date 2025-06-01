/**
 * 
 * @Description: String utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:51:19
 * @LastEditTime: 2025-04-03 10:51:43
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import _ from 'lodash';
import { isJSONObj } from './object';

function preserveCamelCase(str: string): string {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
      str = str.slice(0, i) + '-' + str.slice(i);
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (isLastCharUpper && isLastLastCharUpper && 
               /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
      str = str.slice(0, i - 1) + '-' + str.slice(i - 1);
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = c.toLowerCase() === c && c.toUpperCase() !== c;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = c.toUpperCase() === c && c.toLowerCase() !== c;
    }
  }

  return str;
}

// HTML转义映射
const htmlMaps: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quote;',
  '\'': '&#39;'
} as const;

// 特殊字符映射
const specialMaps: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quote;': '"',
  '&#39;': '\''
} as const;

/**
 * Convert the first letter in the value to uppercase
 *
 * @param {string} value
 * @returns {string}
 */
export function ucFirst(value: string): string {
  const str = _.toString(value || '');
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

/**
 * Convert special characters(> < " ') for entity character
 *
 * @param {string} value
 * @returns {string}
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
 * @returns {string}
 */
export function escapeSpecial(value: string): string {
  for (const n in specialMaps) {
    value = value.replace(new RegExp(n, 'g'), specialMaps[n]);
  }
  return value;
}

/**
 * Generate random string
 *
 * @param {number} [len=16]
 * @returns {string}
 */
export function randStr(len = 16): string {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * Checks if value is a standard JSON string,
 * must be a string, and can be deserialized as an plain object or array
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isJSONStr(value: unknown): value is string {
  if (!_.isString(value)) {
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
 * convert string to camelCase/pascalCase
 *
 * @param {string | string[]} input
 * @param {boolean} [pascalCase=false]
 * @returns {string}
 */
export function camelCase(input: string | string[], pascalCase = false): string {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`');
  }

  const postProcess = (x: string) => pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
  
  let processedInput: string;
  if (Array.isArray(input)) {
    processedInput = input.map((x) => x.trim()).filter((x) => x.length).join('-');
  } else {
    processedInput = input.trim();
  }
  
  if (processedInput.length === 0) {
    return '';
  }
  if (processedInput.length === 1) {
    return pascalCase ? processedInput.toUpperCase() : processedInput.toLowerCase();
  }
  
  const hasUpperCase = processedInput !== processedInput.toLowerCase();
  if (hasUpperCase) {
    processedInput = preserveCamelCase(processedInput);
  }

  processedInput = processedInput
    .replace(/^[_.\- ]+/, '')
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
    .replace(/\d+(\w|$)/g, (m) => m.toUpperCase());
    
  return postProcess(processedInput);
}