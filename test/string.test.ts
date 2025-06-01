/**
 * @Description: String utility tests
 * @Author: richen
 * @Date: 2025-04-25 21:05:00
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import * as stringUtils from '../src/utils/string';

describe('string utils', () => {
  describe('ucFirst', () => {
    it('should capitalize first letter', () => {
      expect(stringUtils.ucFirst('hello')).toBe('Hello');
      expect(stringUtils.ucFirst('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(stringUtils.ucFirst('')).toBe('');
    });
  });

  describe('escapeHtml/escapeSpecial', () => {
    it('should escape HTML special chars', () => {
      expect(stringUtils.escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(stringUtils.escapeHtml('"test"')).toBe('&quote;test&quote;');
    });

    it('should unescape special chars', () => {
      expect(stringUtils.escapeSpecial('<div>')).toBe('<div>');
      expect(stringUtils.escapeSpecial('&quote;test&quote;')).toBe('"test"');
    });
  });

  describe('randStr', () => {
    it('should generate random string with default length', () => {
      const result = stringUtils.randStr();
      expect(result.length).toBe(16);
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate random string with specified length', () => {
      const result = stringUtils.randStr(8);
      expect(result.length).toBe(8);
    });
  });

  describe('isJSONStr', () => {
    it('should validate JSON strings', () => {
      expect(stringUtils.isJSONStr('{"a":1}')).toBe(true);
      expect(stringUtils.isJSONStr('[1,2,3]')).toBe(true);
      expect(stringUtils.isJSONStr('invalid')).toBe(false);
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(stringUtils.camelCase('foo_bar')).toBe('fooBar');
      expect(stringUtils.camelCase('Foo-Bar', true)).toBe('FooBar');
    });
  });
});
