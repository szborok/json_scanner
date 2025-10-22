// utilities/PathProcessor.js

const fs = require('fs');
const readline = require('readline');
const Paths = require('./Paths');
const config = require('../logic/CompanySettings.json');
const { fixJson } = require('./FileUtils');
const { fakeAnalyzeJson } = require('../logic/FakeRuleEngine'); // <- Using the mock analyzer

function fixJsonFile(inputPath, fixedPath) {
    const raw = fs.readFileSync(inputPath, 'utf-8');

    let json;
    try {
        json = JSON.parse(raw);
    } catch (err) {
        console.error(`❌ Failed to parse JSON from: ${inputPath}`);
        console.error(err.message);
        return;
    }

    const fixed = fixJson(json);
    fs.writeFileSync(fixedPath, JSON.stringify(fixed, null, 2), 'utf-8');
    console.log(`✅ Fixed JSON saved to: ${fixedPath}`);

    // Run mock analysis and save results
    const result = fakeAnalyzeJson(fixed);
    const resultPath = getResultPathForFile(inputPath);
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`📊 Analysis saved to: ${resultPath}`);
}

function getResultPathForFile(inputFilePath) {
    const mode = config.processingType;
    const paths = new Paths(mode, inputFilePath);
    return paths.getResultPath(inputFilePath);
}

function askForManualFilePath(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('📝 Enter path to the manual JSON file: ', (inputPath) => {
        rl.close();
        callback(inputPath.trim());
    });
}

function runFixingWithPath(mode, inputPath) {
    if (!inputPath) {
        console.error('❌ No input path provided.');
        return;
    }

    const paths = new Paths(mode, inputPath);
    const inputFiles = paths.getInputFiles();

    if (inputFiles.length === 0) {
        console.warn('⚠️ No input files found.');
        return;
    }

    inputFiles.forEach(inputFile => {
        const fixedPath = paths.getFixedPath(inputFile);
        fixJsonFile(inputFile, fixedPath);
    });
}

function startPathConfiguring() {
    const mode = config.processingType;

    if (mode === 'manual') {
        askForManualFilePath((manualPath) => {
            runFixingWithPath(mode, manualPath);
        });
    } else {
        const inputPath =
            mode === 'auto' ? config.autoProcessFolderPath :
            mode === 'test' ? config.testProcessFolderPath :
            null;

        runFixingWithPath(mode, inputPath);
    }
}

module.exports = { startPathConfiguring };
