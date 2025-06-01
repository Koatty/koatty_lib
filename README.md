# Koatty Lib

[![npm version](https://badge.fury.io/js/koatty_lib.svg)](https://badge.fury.io/js/koatty_lib)
[![Build Status](https://travis-ci.org/koatty/koatty_lib.svg?branch=master)](https://travis-ci.org/koatty/koatty_lib)
[![Coverage Status](https://coveralls.io/repos/github/koatty/koatty_lib/badge.svg?branch=master)](https://coveralls.io/github/koatty/koatty_lib?branch=master)
![npm downloads](https://img.shields.io/npm/dm/koatty_lib)
![license](https://img.shields.io/npm/l/koatty_lib)

Koatty 框架的核心工具库，提供了一系列强大的 TypeScript 工具函数，支持字符串处理、数组操作、对象操作、文件系统、日期时间处理、数学计算、加密功能等。专为现代 Node.js 应用程序设计。

## 特性

🚀 **完整类型支持** - 使用 TypeScript 编写，提供完整的类型定义  
⚡ **高性能优化** - 精心优化的算法和数据结构  
🛡️ **类型安全** - 严格的类型检查，避免运行时错误  
📦 **模块化设计** - 可按需导入，减少包体积  
🧮 **精确数学计算** - 避免浮点数精度问题  
🔐 **安全加密** - 内置 MD5、MurmurHash 等加密算法  
📅 **灵活日期处理** - 支持多种日期格式和时区  
📁 **完整文件操作** - 异步文件系统操作  

## 安装

```bash
npm install koatty_lib
# 或者使用 yarn
yarn add koatty_lib
# 或者使用 pnpm
pnpm add koatty_lib
```

## 快速开始

```typescript
import { Helper } from 'koatty_lib';

// 字符串处理
const name = Helper.ucFirst('hello world'); // "Hello world"
const escaped = Helper.escapeHtml('<script>alert("xss")</script>');

// 数组操作
const uniqueArr = Helper.arrUnique([1, 2, 2, 3, 3]); // [1, 2, 3]
const hasValue = Helper.inArray(2, [1, 2, 3]); // true

// 对象操作
const isEmpty = Helper.isEmpty({}); // true
const cloned = Helper.clone({ a: 1, b: 2 });

// 数学计算（精确计算）
const result = Helper.plus(0.1, 0.2); // 0.3 (避免浮点数误差)
const product = Helper.multi(3.3, 3); // 9.9

// 日期时间
const timestamp = Helper.timestamp(); // 当前时间戳
const formatted = Helper.dateTime('2023-01-01', 'YYYY-MM-DD HH:mm:ss');

// 加密功能
const hash = Helper.md5('hello world');
const saltedHash = Helper.md5Salt('password', 'mysalt');
```

## API 文档

### 字符串工具 (String Utils)

#### `ucFirst(value: string): string`
将字符串首字母转为大写
```typescript
Helper.ucFirst('hello'); // "Hello"
```

#### `escapeHtml(value: string): string`
转义 HTML 特殊字符
```typescript
Helper.escapeHtml('<div>content</div>'); // "&lt;div&gt;content&lt;/div&gt;"
```

#### `randStr(len?: number): string`
生成随机字符串
```typescript
Helper.randStr(8); // "A3fK9mPq"
```

#### `isJSONStr(value: unknown): boolean`
检查是否为有效的 JSON 字符串
```typescript
Helper.isJSONStr('{"name": "test"}'); // true
Helper.isJSONStr('invalid json'); // false
```

#### `camelCase(input: string | string[], pascalCase?: boolean): string`
转换为驼峰命名
```typescript
Helper.camelCase('hello-world'); // "helloWorld"
Helper.camelCase('hello-world', true); // "HelloWorld"
```

### 数组工具 (Array Utils)

#### `arrRemove<T>(arr: T[], index: number): T[]`
移除指定索引的元素
```typescript
Helper.arrRemove([1, 2, 3], 1); // [1, 3]
```

#### `arrUnique<T>(arr: T[]): T[]`
数组去重
```typescript
Helper.arrUnique([1, 2, 2, 3]); // [1, 2, 3]
```

#### `inArray<T>(value: T, arr: T[]): boolean`
检查值是否在数组中
```typescript
Helper.inArray(2, [1, 2, 3]); // true
```

### 对象工具 (Object Utils)

#### `clone<T>(source: T, deep?: boolean): T`
克隆对象（浅拷贝或深拷贝）
```typescript
const obj = { a: 1, b: { c: 2 } };
const shallowClone = Helper.clone(obj); // 浅拷贝
const deepClone = Helper.clone(obj, true); // 深拷贝
```

#### `extend<T, U>(source: T, target: U, deep?: boolean): T & U`
扩展对象属性
```typescript
const source = { a: 1 };
const target = { b: 2 };
const result = Helper.extend(source, target); // { a: 1, b: 2 }
```

#### `isEmpty(value: unknown): boolean`
检查值是否为空
```typescript
Helper.isEmpty({}); // true
Helper.isEmpty([]); // true
Helper.isEmpty(''); // true
Helper.isEmpty('  '); // true
Helper.isEmpty(null); // true
Helper.isEmpty(undefined); // true
```

#### `isJSONObj(value: unknown): boolean`
检查是否为 JSON 对象或数组
```typescript
Helper.isJSONObj({}); // true
Helper.isJSONObj([]); // true
Helper.isJSONObj(null); // false
```

### 数学工具 (Math Utils)

#### 精确计算函数
避免 JavaScript 浮点数精度问题：

```typescript
// 精确加法
Helper.plus(0.1, 0.2); // 0.3

// 精确减法
Helper.minus(1.0, 0.9); // 0.1

// 精确乘法
Helper.multi(0.2, 0.2); // 0.04

// 精确除法
Helper.divide(0.3, 0.1); // 3

// 四舍五入
Helper.round(1.005, 2); // 1.01
```

#### `computeNumber(a: number, type: ComputeType, b: number)`
链式计算
```typescript
const result = Helper.computeNumber(10, '+', 5)
  .next('*', 2)
  .next('-', 5)
  .result; // 25
```

#### `rand(min: number, max: number): number`
生成指定范围的随机整数
```typescript
Helper.rand(1, 10); // 1-10之间的随机整数
```

#### `isNumberString(str: string): boolean`
检查字符串是否为数字
```typescript
Helper.isNumberString('123'); // true
Helper.isNumberString('12.34'); // true
Helper.isNumberString('abc'); // false
```

### 日期时间工具 (Date Utils)

#### `dateTime(date?: number | string, format?: string, offset?: number): number | string`
日期格式化和转换
```typescript
// 获取当前时间戳
Helper.dateTime(); // 1672531200

// 格式化日期
Helper.dateTime('2023-01-01', 'YYYY-MM-DD HH:mm:ss'); // "2023-01-01 00:00:00"

// 带时区偏移
Helper.dateTime('2023-01-01', 'YYYY-MM-DD HH:mm:ss', 8); // UTC+8
```

#### `timestamp(): number`
获取当前时间戳（秒）
```typescript
Helper.timestamp(); // 1672531200
```

#### `isDate(value: any): boolean`
检查是否为有效的日期对象
```typescript
Helper.isDate(new Date()); // true
Helper.isDate('2023-01-01'); // false
```

### 文件系统工具 (File Utils)

#### 异步文件操作
```typescript
// 读取文件
const content = await Helper.readFile('./test.txt');

// 写入文件
await Helper.writeFile('./output.txt', 'Hello World');

// 创建目录
await Helper.mkdir('./new-directory');

// 读取目录
const files = await Helper.readdir('./directory');

// 删除文件
await Helper.rmfile('./file-to-delete.txt');

// 删除目录
await Helper.rmdir('./directory-to-delete');
```

#### 同步检查函数
```typescript
// 检查是否为目录
Helper.isDir('./path'); // boolean

// 检查是否为文件
Helper.isFile('./file.txt'); // boolean

// 检查是否可写
Helper.isWritable('./path'); // boolean
```

### 加密工具 (Crypto Utils)

#### `md5(value: string): string`
计算 MD5 哈希值
```typescript
Helper.md5('hello world'); // "5d41402abc4b2a76b9719d911017c592"
```

#### `md5Salt(value: string, salt?: string): string`
带盐值的 MD5 哈希
```typescript
Helper.md5Salt('password', 'mysalt'); // 加盐哈希值
```

#### `murmurHash(value: string, seed?: number, ver?: number): string`
MurmurHash 算法
```typescript
Helper.murmurHash('hello', 97, 2); // MurmurHash v2
Helper.murmurHash('hello', 97, 3); // MurmurHash v3
```

### 函数工具 (Function Utils)

#### `promisify<T>(fn: T, receiver?: unknown): (...args: Parameters<T>) => Promise<any>`
将回调函数转换为 Promise
```typescript
const fs = require('fs');
const readFileAsync = Helper.promisify(fs.readFile);
const content = await readFileAsync('./file.txt', 'utf8');
```

#### `isPromise(value: unknown): boolean`
检查是否为 Promise 对象
```typescript
Helper.isPromise(Promise.resolve()); // true
Helper.isPromise({}); // false
```

#### `isGenerator(fn: unknown): boolean`
检查是否为生成器函数
```typescript
Helper.isGenerator(function* () {}); // true
Helper.isGenerator(function () {}); // false
```

#### `isAsyncFunction(fn: unknown): boolean`
检查是否为异步函数
```typescript
Helper.isAsyncFunction(async function () {}); // true
Helper.isAsyncFunction(function () {}); // false
```

#### `safeRequire(file: string): any`
安全的模块加载
```typescript
const module = Helper.safeRequire('./optional-module');
```

### Lodash 函数
Koatty Lib 还直接导出了常用的 Lodash 函数：

```typescript
// 类型检查
Helper.isArray([]);
Helper.isString('');
Helper.isNumber(123);
Helper.isBoolean(true);
Helper.isFunction(() => {});
Helper.isObject({});

// 比较函数
Helper.isEqual(a, b);
Helper.gt(a, b);
Helper.gte(a, b);
Helper.lt(a, b);
Helper.lte(a, b);

// 转换函数
Helper.toArray(value);
Helper.toInteger(value);
Helper.toNumber(value);
Helper.toString(value);
```

## 使用示例

### 完整的使用示例

```typescript
import { Helper } from 'koatty_lib';

async function processUserData() {
  // 1. 数据验证和清理
  const userInput = "  john doe  ";
  const cleanName = Helper.ucFirst(userInput.trim()); // "John doe"
  
  // 2. 数据转换
  const userData = {
    name: cleanName,
    email: "john@example.com",
    scores: [85, 92, 78, 85, 90]
  };
  
  // 3. 数组处理
  const uniqueScores = Helper.arrUnique(userData.scores); // [85, 92, 78, 90]
  const hasHighScore = Helper.inArray(92, uniqueScores); // true
  
  // 4. 数学计算
  const average = uniqueScores.reduce((sum, score) => 
    Helper.plus(sum, score), 0) / uniqueScores.length;
  const roundedAverage = Helper.round(average, 2);
  
  // 5. 对象操作
  const processedData = Helper.extend(userData, {
    averageScore: roundedAverage,
    processedAt: Helper.timestamp(),
    id: Helper.md5(userData.email)
  });
  
  // 6. 文件操作
  const jsonData = JSON.stringify(processedData, null, 2);
  await Helper.writeFile('./user-data.json', jsonData);
  
  // 7. 日期格式化
  const formattedDate = Helper.dateTime(
    processedData.processedAt, 
    'YYYY-MM-DD HH:mm:ss'
  );
  
  console.log(`用户数据已处理完成，时间：${formattedDate}`);
  return processedData;
}
```

### Web 应用中的使用

```typescript
import { Helper } from 'koatty_lib';

// 用户注册处理
async function registerUser(userData: any) {
  // 数据验证
  if (Helper.isEmpty(userData.email) || Helper.isEmpty(userData.password)) {
    throw new Error('邮箱和密码不能为空');
  }
  
  // 数据清理
  const cleanData = {
    email: userData.email.toLowerCase().trim(),
    username: Helper.ucFirst(userData.username),
    password: Helper.md5Salt(userData.password, 'app_secret_salt')
  };
  
  // 生成用户ID
  cleanData.id = Helper.murmurHash(cleanData.email + Helper.timestamp());
  
  return cleanData;
}

// API 响应格式化
function formatApiResponse(data: any, success = true) {
  return {
    success,
    timestamp: Helper.timestamp(),
    data: Helper.clone(data, true), // 深拷贝避免数据污染
    requestId: Helper.randStr(16)
  };
}

// 文件上传处理
async function handleFileUpload(file: Buffer, originalName: string) {
  const fileHash = Helper.md5(file.toString());
  const fileName = `${fileHash}_${Helper.randStr(8)}.${originalName.split('.').pop()}`;
  const filePath = `./uploads/${fileName}`;
  
  await Helper.mkdir('./uploads');
  await Helper.writeFile(filePath, file);
  
  return {
    filename: fileName,
    path: filePath,
    hash: fileHash,
    uploadedAt: Helper.dateTime(undefined, 'YYYY-MM-DD HH:mm:ss')
  };
}
```

## 版本要求

- Node.js >= 10.0.0
- TypeScript >= 4.0.0 (如果使用 TypeScript)

## 依赖

- `lodash` - 提供基础工具函数
- `date-fns` - 日期处理库
- `murmurhash` - MurmurHash 算法实现
- `co` - Generator 函数支持

## 构建和开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run eslint

# 生成文档
npm run build:doc
```

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

BSD 3-Clause License - 查看 [LICENSE](LICENSE) 文件了解详情

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史

## 支持

- 📖 [文档](https://github.com/koatty/koatty_lib/docs)
- 🐛 [问题报告](https://github.com/koatty/koatty_lib/issues)
- 💬 [讨论区](https://github.com/koatty/koatty_lib/discussions)

---

Made with ❤️ by [Koatty Team](https://github.com/koatty)
