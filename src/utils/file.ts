/**
 * 
 * @Description: File system utility functions
 * @Author: richen
 * @Date: 2025-04-03 10:51:19
 * @LastEditTime: 2025-04-03 10:51:43
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import fs from 'fs';
import path from 'path';

/**
 * Change file mode
 */
export function chmod(filePath: string, mode: string | number) {
  return fs.promises.chmod(filePath, mode);
}

/**
 * Create directory recursively
 */
export function mkdir(dirPath: string) {
  return fs.promises.mkdir(dirPath, { recursive: true });
}

/**
 * Read directory contents
 */
export function readdir(dirPath: string) {
  return fs.promises.readdir(dirPath);
}

/**
 * Read file contents
 */
export function readFile(filePath: string, encoding: BufferEncoding = 'utf8') {
  return fs.promises.readFile(filePath, { encoding });
}

/**
 * Rename file
 */
export function refile(oldPath: string, newPath: string) {
  return fs.promises.rename(oldPath, newPath);
}

/**
 * Remove directory
 */
export function rmdir(dirPath: string) {
  return fs.promises.rm(dirPath, { recursive: true, force: true });
}

/**
 * Remove file
 */
export function rmfile(filePath: string) {
  return fs.promises.unlink(filePath);
}

/**
 * Write data to file
 */
export function writeFile(filePath: string, data: string | Buffer) {
  return fs.promises.writeFile(filePath, data);
}

/**
 * Check if path is directory
 */
export function isDir(filePath: string) {
  return fs.promises.stat(filePath)
    .then(stat => stat.isDirectory())
    .catch(() => false);
}

/**
 * Check if path is file
 */
export function isFile(filePath: string) {
  return fs.promises.stat(filePath)
    .then(stat => stat.isFile())
    .catch(() => false);
}

/**
 * Get path separator
 */
export const sep = path.sep;
