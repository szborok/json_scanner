// utilities/Paths.js

const fs = require('fs');
const path = require('path');

class Paths {
  constructor(mode, basePath) {
    this.mode = mode;
    this.basePath = basePath;
  }

  getInputFiles() {
    // For manual mode, basePath can be a single file
    if (this.mode === 'manual') {
      if (fs.existsSync(this.basePath) && fs.statSync(this.basePath).isFile()) {
        return [this.basePath];
      }
      return [];
    }

    // For other modes, assume basePath is a folder, get all JSON files recursively
    return this.getAllJsonFiles(this.basePath);
  }

  getAllJsonFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllJsonFiles(filePath));
      } else if (
        path.extname(file) === '.json' &&
        !file.endsWith('_fixed.json') &&
        !file.endsWith('_result.json')
      ) {
        results.push(filePath);
      }
    }
    return results;
  }

  getFixedPath(inputFilePath) {
    // Save fixed JSON next to original with suffix "_fixed.json"
    const dir = path.dirname(inputFilePath);
    const base = path.basename(inputFilePath, '.json');
    return path.join(dir, `${base}_fixed.json`);
  }

  getResultPath(inputFilePath) {
    // Save analysis results with suffix "_result.json"
    const dir = path.dirname(inputFilePath);
    const base = path.basename(inputFilePath, '.json');
    return path.join(dir, `${base}_result.json`);
  }
}

module.exports = Paths;
