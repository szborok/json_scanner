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
        this.filePath = await this.askFilePath();  // Wait for user input
        if (!fs.existsSync(this.filePath)) {
            throw new Error('File does not exist: ' + this.filePath);
        }

        this.folder = path.dirname(this.filePath);
        this.fileName = path.basename(this.filePath);

        const ext = path.extname(this.fileName);
        const baseName = path.basename(this.fileName, ext);
        this.fileNameFixed = `${baseName}_FIXED${ext}`;

        this.fixNaNInJsonFile(); // Modify file contents (optional)
        this.data = this.loadJson(); // Load JSON data
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

    fixNaNInJsonFile() {
        let content = fs.readFileSync(this.filePath, 'utf8');
        content = content.replace(/: NaN/g, ': null');
        const fixedPath = path.join(this.folder, this.fileNameFixed);
        fs.writeFileSync(fixedPath, content, 'utf8');
        console.log(`Fixed NaN values and saved to ${this.fileNameFixed}`);
    }

    loadJson() {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }
}

module.exports = InputJsonFile;
