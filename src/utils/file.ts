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
export function chmod(filePath: string, mode = '777') {
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
 * Rename the file. If newFileName and fileName be not in the same physical path, 
 * the move file action will be triggered.
 * Asynchronous mode
 *
 * @param {string} FileName
 * @param {string} newFileName
 * @returns {*}  {Promise<any>}
 */
export function reFile(fileName: string, newFileName: string): Promise<any> {
  return fs.promises.rename(fileName, newFileName);
}

/**
 * Delete the file p.
 * Asynchronous mode
 *
 * @param {string} p
 * @returns {*}  {Promise<any>}
 */
export function rmFile(p: string): Promise<any> {
  return fs.promises.unlink(p);
}

/**
 * According to the path p to create a folder, 
 * p contains multi-level new path will be automatically recursively created.
 * Asynchronous mode
 *
 * @param {string} p
 * @param {string} [mode='0777']
 * @returns {Promise<any>}  
 */
export function mkDir(p: string, mode = '0777'): Promise<any> {
  return fs.promises.mkdir(p, { recursive: true, mode });
}

/**
 * Recursively read directory contents with filtering support
 * 
 * @param {string} dirPath - Path to directory
 * @param {(filePath: string, dirent: fs.Dirent) => boolean} [filter] - Optional filter function
 * @param {string} [prefix=''] - Optional path prefix for relative paths
 * @returns {Promise<string[]>} Array of relative file paths
 * @throws {Error} If directory cannot be read
 */
export async function readDir(
  dirPath: string,
  filter: (filePath: string, dirent: fs.Dirent) => boolean = () => true,
  prefix: string = ''
): Promise<string[]> {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(prefix, entry.name);

      if (!filter(relativePath, entry)) {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await readDir(fullPath, filter, relativePath);
        results.push(...subFiles);
      } else {
        results.push(relativePath);
      }
    }

    return results;
  } catch (err) {
    throw new Error(`Failed to read directory ${dirPath}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Remove directory recursively
 * 
 * @param {string} dirPath - Path to directory
 * @param {boolean} [removeRoot=true] - Whether to remove the root directory
 * @returns {Promise<void>}
 */
export function rmDir(dirPath: string, removeRoot: boolean = true): Promise<void> {
  return fs.promises.rm(dirPath, { recursive: true, force: removeRoot });
}

/**
 * Checks if path is a dir
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export function isDir(filePath: string) {
  return fs.statSync(filePath).isDirectory();
}

/**
 * Checks if path is a file
 * Synchronous mode
 *
 * @param {string} p
 * @returns {*}  {boolean}
 */
export function isFile(filePath: string) {
  return fs.statSync(filePath).isFile();
}

/**
 * Get path separator
 */
export const sep = path.sep;

/**
 * Check if path is writable
 * Synchronous mode
 * 
 * @param {string} path - Path to check
 * @returns {boolean} True if writable
 */
export function isWritable(p: string): boolean {
  try {
    const stats = fs.statSync(p);
    const mode = stats.mode;
    const uid = process.getuid ? process.getuid() : 0;
    const gid = process.getgid ? process.getgid() : 0;
    const owner = uid === stats.uid;
    const group = gid === stats.gid;
    return !!(owner && (mode & parseInt('00200', 8)) ||
      group && (mode & parseInt('00020', 8)) ||
      (mode & parseInt('00002', 8)));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}
