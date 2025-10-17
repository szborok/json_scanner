// inputJsonFile.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class InputJsonFile {
    constructor() {
        this.filePath = '';
        this.folder = '';
        this.fileName = '';
        this.fileNameFixed = '';
        this.data = null;
    }

    async init() {
        this.filePath = await this.askFilePath();  // Prompt user
        if (!fs.existsSync(this.filePath)) {
            throw new Error('File does not exist: ' + this.filePath);
        }

        const result = InputJsonFile.prepareFile(this.filePath);
        this.folder = result.folder;
        this.fileName = result.fileName;
        this.fileNameFixed = result.fileNameFixed;
        this.data = result.data;
    }

    askFilePath() {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the full path to the JSON file: ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    static prepareFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist: ' + filePath);
        }

        const folder = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        const fileNameFixed = `${baseName}_FIXED${ext}`;

        // Fix NaNs
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/: NaN/g, ': null');

        const fixedPath = path.join(folder, fileNameFixed);
        fs.writeFileSync(fixedPath, content, 'utf8');
        console.log(`Fixed NaN values and saved to ${fileNameFixed}`);

        const data = JSON.parse(content);

        return {
            folder,
            fileName,
            fileNameFixed,
            data
        };
    }
}

module.exports = InputJsonFile;
