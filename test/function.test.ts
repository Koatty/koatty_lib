/**
 * @Description: Function utility tests
 * @Author: richen
 * @Date: 2025-04-25 21:09:00
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import * as functionUtils from '../src/utils/function';

describe('function utils', () => {
  describe('toFastProperties', () => {
    it('should optimize object property access', () => {
      const obj = { a: 1 };
      expect(() => functionUtils.toFastProperties(obj)).not.toThrow();
    });
  });

  describe('getDefer', () => {
    it('should return defer object with promise and resolve/reject', () => {
      const defer = functionUtils.getDefer();
      expect(defer).toHaveProperty('promise');
      expect(defer).toHaveProperty('resolve');
      expect(defer).toHaveProperty('reject');
      expect(defer.promise).toBeInstanceOf(Promise);
    });
  });

  describe('safeRequire/thinkrequire', () => {
    it('should throw error for non-existent module', () => {
      expect(() => functionUtils.safeRequire('nonexistent')).toThrow();
    });
  });

  describe('isPromise', () => {
    it('should identify promise objects', () => {
      const promise = new Promise(() => {});
      expect(functionUtils.isPromise(promise)).toBe(true);
      expect(functionUtils.isPromise({})).toBe(false);
    });
  });

  describe('promisify', () => {
    it('should convert callback to promise', async () => {
      const fn = (arg: string, cb: Function) => cb(null, arg);
      const promisified = functionUtils.promisify(fn);
      await expect(promisified('test')).resolves.toBe('test');
    });
  });

  describe('isGenerator/isAsyncFunction', () => {
    it('should identify generator functions', () => {
      function* gen() { yield 1; }
      expect(functionUtils.isGenerator(gen)).toBe(true);
      expect(functionUtils.isGenerator(() => {})).toBe(false);
    });

    it('should identify async functions', () => {
      const asyncFn = async () => {};
      expect(functionUtils.isAsyncFunction(asyncFn)).toBe(true);
      expect(functionUtils.isAsyncFunction(() => {})).toBe(false);
    });
  });

  describe('generatorToPromise', () => {
    it('should convert generator to promise', async () => {
      function* gen() { yield 1; }
      const result = functionUtils.generatorToPromise(gen);
      expect(result).toBeInstanceOf(Function);
    });
  });
});
