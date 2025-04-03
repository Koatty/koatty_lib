/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 11:07:05
 * @LastEditTime: 2025-04-03 14:03:18
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import { Helper } from '../src/index';

describe('Array Utilities', () => {
  describe('inArray', () => {
    const testArr = [1, 2, 3, 'a', 'b'];

    test('should find existing elements', () => {
      expect(Helper.inArray(2, testArr)).toBe(true);
      expect(Helper.inArray('a', testArr)).toBe(true);
    });

    test('should not find missing elements', () => {
      expect(Helper.inArray(4, testArr)).toBe(false);
    });

    test('should throw on non-array input', () => {
      expect(() => Helper.inArray(1, {} as any)).toThrow(TypeError);
    });
  });

  describe('arrRemove', () => {
    test('should remove item at index', () => {
      const arr = [1, 2, 3];
      expect(Helper.arrRemove(arr, 1)).toEqual([1, 3]);
    });

    test('should handle out of bounds index', () => {
      const arr = [1, 2, 3];
      expect(Helper.arrRemove(arr, 5)).toEqual([1, 2, 3]);
    });
  });
});
