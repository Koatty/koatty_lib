/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 11:06:22
 * @LastEditTime: 2025-04-03 11:06:49
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import { computeNumber, checkBoundary, multi, divide } from '../src/index';

describe('Number Utilities', () => {
  describe('computeNumber', () => {
    test('should handle basic addition', () => {
      expect(computeNumber(0.1, '+', 0.2).result).toBeCloseTo(0.3);
    });

    test('should handle chained operations', () => {
      const result = computeNumber(0.1, '+', 0.2)
        .next('*', 10)
        .result;
      expect(result).toBeCloseTo(3);
    });

    test('should throw on division by zero', () => {
      expect(() => computeNumber(1, '/', 0)).toThrow('Division by zero');
    });

    test('should throw on invalid number', () => {
      expect(() => computeNumber(NaN, '+', 1)).toThrow('Is not a number');
    });
  });

  describe('checkBoundary', () => {
    test('should accept safe integers', () => {
      expect(() => checkBoundary(Number.MAX_SAFE_INTEGER)).not.toThrow();
    });

    test('should throw on unsafe integers', () => {
      expect(() => checkBoundary(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
    });
  });

  describe('multi', () => {
    test('should handle decimal multiplication', () => {
      expect(multi(0.1, 0.2)).toBeCloseTo(0.02);
    });
  });

  describe('divide', () => {
    test('should handle decimal division', () => {
      expect(divide(1, 3)).toBeCloseTo(0.333333);
    });
  });
});
