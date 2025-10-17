// main.js

const fs = require('fs');
const path = require('path');

const Project = require('./Project');
const RuleEngine = require('./RuleEngine');
const InputJsonFile = require('./inputJsonFile');

const configPath = path.join(__dirname, 'settings.json');
const settings = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const fixedDir = path.resolve(__dirname, settings.fixedOutputPath || './data/fixed');
const resultDir = path.resolve(__dirname, settings.resultOutputPath || './data/result');

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

async function processFile(fileName, rawData, fixedPath, resultFilePath) {
    const project = new Project(rawData);

    const fixedJson = JSON.stringify(project.toJSON(), null, 2);
    fs.writeFileSync(fixedPath, fixedJson, 'utf-8');
    console.log(`✅ Fixed and saved: ${path.basename(fixedPath)}`);

    const ruleEngine = new RuleEngine(project);
    const result = ruleEngine.runAllChecks();

    fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`📄 Analysis result written: ${path.basename(resultFilePath)}`);
}

async function main() {
    ensureDirExists(fixedDir);
    ensureDirExists(resultDir);

    const processingType = settings.processingType;

    if (processingType === 'automatic') {
        const inputDir = path.resolve(__dirname, settings.autoInputPath || './data/input');
        ensureDirExists(inputDir);

        const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

        for (const file of inputFiles) {
            try {
                const inputPath = path.join(inputDir, file);
                const { data, fileNameFixed } = InputJsonFile.prepareFile(inputPath);

                const fixedPath = path.join(fixedDir, fileNameFixed);
                const baseName = path.basename(file, '.json');
                const resultFilePath = path.join(resultDir, `${baseName}-result.json`);

                await processFile(file, data, fixedPath, resultFilePath);
            } catch (error) {
                console.error(`❌ Failed processing ${file}:`, error);
            }
        }

    } else if (processingType === 'manual') {
        try {
            const input = new InputJsonFile();
            await input.init(); // Prompts for file, internally calls prepareFile()

            const fixedPath = path.join(input.folder, input.fileNameFixed);
            const baseName = path.parse(input.fileName).name;
            const resultFilePath = path.join(input.folder, `${baseName}-result.json`);

            await processFile(input.fileName, input.data, fixedPath, resultFilePath);
        } catch (err) {
            console.error('❌ Manual mode failed:', err.message);
        }
    } else {
        console.error('❌ Invalid "processingType" in settings.json. Use "manual" or "automatic".');
    }
}

main();
