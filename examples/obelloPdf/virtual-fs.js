import path from "path";

const __filename = path.resolve();

const __dirname = path.dirname(__filename);
console.log("process.cwd()", process.cwd());
console.log("__dirname", __dirname);
console.log("__filename", __filename);
class VirtualFileSystem {
  constructor() {
    this.fileData = {};
  }

  readFileSync(fileName, options = {}) {
    const encoding = typeof options === "string" ? options : options.encoding;
    console.log("fileName", fileName);
    console.log("this.fileData", this.fileData);
    const virtualFileName = normalizeFilename(fileName);
    console.log("virtualFileName", virtualFileName);
    const data = this.fileData[virtualFileName];

    if (data == null) {
      throw new Error(
        `File '${virtualFileName}' not found in virtual file system`
      );
    }

    if (encoding) {
      // return a string
      return typeof data === "string" ? data : data.toString(encoding);
    }

    return Buffer.from(data, typeof data === "string" ? "base64" : undefined);
  }

  readFile(fileName, options = {}, callback) {
    try {
      const data = this.readFileSync(fileName, options);
      callback(null, data);
    } catch (error) {
      callback(error);
    }
  }

  writeFileSync(fileName, content) {
    this.fileData[normalizeFilename(fileName)] = content;
  }

  bindFileData(data = {}, options = {}) {
    if (options.reset) {
      this.fileData = data;
    } else {
      Object.assign(this.fileData, data);
    }
  }

  mkdirSync(dirName) {
    const virtualDirName = normalizeFilename(dirName);
    if (this.fileData[virtualDirName]) {
      throw new Error(`Directory '${virtualDirName}' already exists`);
    }
    this.fileData[virtualDirName] = {}; // Simulate directory as an empty object
  }
}

function normalizeFilename(fileName) {
  if (fileName.indexOf(__dirname) === 0) {
    fileName = fileName.substring(__dirname.length);
  }

  if (fileName.indexOf("/") === 0) {
    fileName = fileName.substring(1);
  }

  return fileName;
}

// Export the instance and methods
const virtualFileSystem = new VirtualFileSystem();
export const readFileSync =
  virtualFileSystem.readFileSync.bind(virtualFileSystem);
export const readFile = virtualFileSystem.readFile.bind(virtualFileSystem);
export const mkdirSync = virtualFileSystem.mkdirSync.bind(virtualFileSystem);
export default virtualFileSystem;
