const readline = require('readline');
const fs = require('fs');
const path = require('path');

function loadJson(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}


function writeResult(folder, baseName, content) {
    const resultFile = path.join(folder, `${baseName}_borokCheckResult.txt`);
    fs.writeFileSync(resultFile, content, 'utf8');
    console.log(`Result written to ${resultFile}`);
}


function scanTheJsonFilesFolderforNCFiles(folder) {
    const files = fs.readdirSync(folder);
    return files.filter(file => file.endsWith('.h'));
}

module.exports = { fixNaNInJsonFile, loadJson, askFilePath, writeResult };