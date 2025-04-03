import * as fileUtils from '../src/utils/file';
import fs from 'fs';
import path from 'path';

describe('file utils', () => {
  const testDir = path.join(__dirname, 'test-dir');
  const testFile = path.join(testDir, 'test.txt');

  beforeAll(async () => {
    // 创建测试目录和文件
    await fs.promises.mkdir(testDir, { recursive: true });
    await fs.promises.writeFile(testFile, 'test content');
  });

  afterAll(async () => {
    // 清理测试目录
    await fs.promises.rm(testDir, { recursive: true, force: true });
  });

  describe('chmod', () => {
    it('should change file mode', async () => {
      await expect(fileUtils.chmod(testFile, '755')).resolves.not.toThrow();
    });

    it('should throw for non-existent file', async () => {
      await expect(fileUtils.chmod('nonexistent', '755')).rejects.toThrow();
    });
  });

  describe('mkdir', () => {
    it('should create directory', async () => {
      const dir = path.join(testDir, 'new-dir');
      await expect(fileUtils.mkdir(dir)).resolves.not.toThrow();
      await expect(fs.promises.stat(dir)).resolves.toBeDefined();
    });
  });

  describe('readdir', () => {
    it('should list directory contents', async () => {
      const files = await fileUtils.readdir(testDir);
      expect(files).toContain('test.txt');
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const content = await fileUtils.readFile(testFile);
      expect(content).toBe('test content');
    });
  });

  describe('refile', () => {
    it('should rename file', async () => {
      const newPath = path.join(testDir, 'renamed.txt');
      await expect(fileUtils.refile(testFile, newPath)).resolves.not.toThrow();
      await expect(fs.promises.stat(newPath)).resolves.toBeDefined();
    });
  });

  describe('rmfile', () => {
    it('should remove file', async () => {
      const tempFile = path.join(testDir, 'temp.txt');
      await fs.promises.writeFile(tempFile, 'temp');
      await expect(fileUtils.rmfile(tempFile)).resolves.not.toThrow();
      await expect(fs.promises.stat(tempFile)).rejects.toThrow();
    });
  });

  describe('writeFile', () => {
    it('should write data to file', async () => {
      const tempFile = path.join(testDir, 'write-test.txt');
      await expect(fileUtils.writeFile(tempFile, 'new content')).resolves.not.toThrow();
      const content = await fs.promises.readFile(tempFile, 'utf8');
      expect(content).toBe('new content');
    });
  });

  describe('isDir', () => {
    it('should return true for directory', async () => {
      await expect(fileUtils.isDir(testDir)).resolves.toBe(true);
    });

    it('should return false for file', async () => {
      await expect(fileUtils.isDir(testFile)).resolves.toBe(false);
    });
  });

  describe('isFile', () => {
    it('should return true for file', async () => {
      await expect(fileUtils.isFile(testFile)).resolves.toBe(true);
    });

    it('should return false for directory', async () => {
      await expect(fileUtils.isFile(testDir)).resolves.toBe(false);
    });
  });

  describe('isWritable', () => {
    it('should check file writable status', () => {
      expect(fileUtils.isWritable(testFile)).toBe(true);
    });
  });

  // 测试readDir函数
  describe('readDir', () => {
    it('should recursively read directory', async () => {
      const subDir = path.join(testDir, 'sub');
      await fs.promises.mkdir(subDir);
      await fs.promises.writeFile(path.join(subDir, 'subfile.txt'), 'sub');

      const files = await fileUtils.readDir(testDir);
      expect(files).toEqual(expect.arrayContaining([
        'test.txt',
        'sub/subfile.txt'
      ]));
    });
  });
});
