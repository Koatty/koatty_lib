import * as fileUtils from '../src/utils/file';
import fs from 'fs';
import path from 'path';

describe('file utils', () => {
  const testDir = path.join(__dirname, 'test-dir');
  const testFile = path.join(testDir, 'test.txt');
  const testContent = 'test content';

  beforeAll(async () => {
    // 清理可能存在的旧目录
    try {
      await fs.promises.rm(testDir, { recursive: true, force: true });
    } catch (e) {
      // ignore error
    }

    // 创建测试目录和文件
    await fs.promises.mkdir(testDir, { recursive: true });
    await fs.promises.writeFile(testFile, testContent);
    await fs.promises.chmod(testFile, 0o666); // 确保文件可写
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
      expect(content).toBe(testContent);
    });
  });

  describe('refile', () => {
    it('should rename file', async () => {
      const tempFile = path.join(testDir, 'temp-for-rename.txt');
      await fs.promises.writeFile(tempFile, testContent);
      const newPath = path.join(testDir, 'renamed.txt');
      await expect(fileUtils.refile(tempFile, newPath)).resolves.not.toThrow();
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
    it('should return true for directory', () => {
      expect(fileUtils.isDir(testDir)).toBe(true);
    });

    it('should return false for file', () => {
      expect(fileUtils.isDir(testFile)).toBe(false);
    });
  });

  describe('isFile', () => {
    it('should return true for file', () => {
      expect(fileUtils.isFile(testFile)).toBe(true);
    });

    it('should return false for directory', () => {
      expect(fileUtils.isFile(testDir)).toBe(false);
    });
  });

  describe('isWritable', () => {
    it('should check file writable status', () => {
      expect(fileUtils.isWritable(testFile)).toBe(true);
    });
  });

  describe('readDir', () => {
    it('should recursively read directory', async () => {
      // 创建测试目录结构
      const subDir = path.join(testDir, 'sub');
      await fs.promises.mkdir(subDir, { recursive: true });
      await fs.promises.writeFile(path.join(subDir, 'subfile.txt'), 'sub');
      await fs.promises.writeFile(path.join(testDir, 'test.txt'), 'test');

      const files = await fileUtils.readDir(testDir);
      // 确保文件路径使用正斜杠
      const normalizedFiles = files.map(f => f.replace(/\\/g, '/'));
      
      expect(normalizedFiles).toContain('test.txt');
      expect(normalizedFiles).toContain('sub/subfile.txt');
    });
  });
});
