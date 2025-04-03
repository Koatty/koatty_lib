/**
 * 
 * @Description: 
 * @Author: richen
 * @Date: 2025-04-03 15:34:52
 * @LastEditTime: 2025-04-03 15:35:36
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */
import * as dateUtils from '../src/utils/date';
import moment from 'moment';
import _ from 'lodash';

describe('date utils', () => {
  // Mock当前时间为固定UTC时间2025-01-01 00:00:00
  const mockDate = new Date('2025-01-01T00:00:00Z');
  const realDate = Date;

  beforeAll(() => {
    global.Date = class extends realDate {
      constructor() {
        super();
        return mockDate;
      }

      static now() {
        return mockDate.getTime();
      }
    } as any;
  });

  afterAll(() => {
    global.Date = realDate;
  });

  describe('dateTime', () => {
    it('should return current timestamp when no params', () => {
      const result = dateUtils.dateTime();
      expect(result).toBe(Math.floor(mockDate.getTime() / 1000));
    });

    it('should convert date string to timestamp', () => {
      const result = dateUtils.dateTime('2025-01-01');
      expect(result.toString()).toMatch(/\d{10}$/);
    });

    it('should format timestamp to string', () => {
      const result = dateUtils.dateTime(1735689600, 'YYYY-MM-DD');
      expect(result).toBe('2025-01-01');
    });

    it('should format date string to another format', () => {
      const result = dateUtils.dateTime('2025-01-01', 'YYYY/MM/DD');
      expect(result).toBe('2025/01/01');
    });

    it('should handle milliseconds timestamp', () => {
      const result = dateUtils.dateTime(1735689600, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2025-01-01 08:00:00');
    });

    it('should use default format when empty', () => {
      const result = dateUtils.dateTime(undefined, '');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    });
  });

  describe('datetime', () => {
    it('should be alias of dateTime', () => {
      expect(dateUtils.datetime).toBe(dateUtils.dateTime);
    });
  });

  describe('DateTime Edge Cases', () => {
    it('should handle 10-digit timestamp (seconds)', () => {
      const result = dateUtils.dateTime(1735689600, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2025-01-01 08:00:00');
    });

    it('should handle 13-digit timestamp (milliseconds)', () => {
      const result = dateUtils.dateTime(1735689600000, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2025-01-01 08:00:00');
    });

    it('should parse ISO format with T separator', () => {
      const result = dateUtils.dateTime('2025-01-01T08:00:00.000Z', 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2025-01-01 08:00:00');
    });

    it('should throw error for invalid date string', () => {
      expect(() => dateUtils.dateTime('2025-13-01', 'YYYY-MM-DD')).toThrow();
    });
  });

  describe('isDate', () => {
    it('should return true for Date object', () => {
      expect(dateUtils.isDate(new Date())).toBe(true);
    });

    it('should return false for non-Date values', () => {
      expect(dateUtils.isDate('2025-01-01')).toBe(false);
      expect(dateUtils.isDate(1234567890)).toBe(false);
      expect(dateUtils.isDate(null)).toBe(false);
    });
  });

  describe('timestamp', () => {
    it('should return current timestamp in seconds', () => {
      const result = dateUtils.timestamp();
      expect(result).toBe(Math.floor(mockDate.getTime() / 1000));
    });
  });
});
