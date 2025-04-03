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

/**
 * Convert string to camelCase/pascalCase
 */
export function camelCase(input: string, pascalCase = false) {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected string or string[]');
  }

  const postProcess = (x: string) => pascalCase ? 
    x.charAt(0).toUpperCase() + x.slice(1) : x;

  if (Array.isArray(input)) {
    input = input.map(x => x.trim()).filter(x => x.length).join('-');
  } else {
    input = input.trim();
  }

  if (input.length === 0) return '';
  if (input.length === 1) return pascalCase ? input.toUpperCase() : input.toLowerCase();

  if (input !== input.toLowerCase()) {
    input = preserveCamelCase(input);
  }

  input = input
    .replace(/^[_.\- ]+/, '')
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
    .replace(/\d+(\w|$)/g, m => m.toUpperCase());

  return postProcess(input);
}

function preserveCamelCase(str: string) {
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

/**
 * Convert first letter to uppercase
 */
export function ucfirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string) {
  return str.replace(/[&<>"'`]/g, match => {
    switch (match) {
      case '&': return '&';
      case '<': return '<';
      case '>': return '>';
      case '"': return '"';
      case "'": return '&#39;';
      case '`': return '&#96;';
      default: return match;
    }
  });
}

/**
 * Generate random string
 */
export function rand(len = 16) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
