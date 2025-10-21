// utilities/init.js

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "settings.json");
const settings = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const fixedDir = path.resolve(
  __dirname,
  settings.fixedOutputPath || "./data/fixed"
);
const resultDir = path.resolve(
  __dirname,
  settings.resultOutputPath || "./data/result"
);

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = {
  fixedDir,
  resultDir,
  ensureDirExists,
};
