const fs = require('fs');
const path = require('path');

const Project = require('./Project');
const RuleEngine = require('./RuleEngine');

const inputDir = path.join(__dirname, 'data', 'input');
const fixedDir = path.join(__dirname, 'data', 'fixed');
const resultDir = path.join(__dirname, 'data', 'result');

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

async function main() {
    ensureDirExists(fixedDir);
    ensureDirExists(resultDir);
    ensureDirExists(inputDir);

    const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

    for (const file of inputFiles) {
        try {
            const inputPath = path.join(inputDir, file);
            const rawJson = fs.readFileSync(inputPath, 'utf-8');
            const rawData = JSON.parse(rawJson);

            // Initialize Project and normalize/fix data
            const project = new Project(rawData);

            // Save fixed project JSON
            const fixedJson = JSON.stringify(project.toJSON(), null, 2);
            const fixedPath = path.join(fixedDir, file);
            fs.writeFileSync(fixedPath, fixedJson, 'utf-8');
            console.log(`✅ Fixed and saved: ${file}`);

            // Run rules on project
            const ruleEngine = new RuleEngine(project);
            const result = ruleEngine.runAllChecks();

            // Write analysis result per project
            const baseName = path.basename(file, '.json');
            const resultFileName = `${baseName}-result.json`;
            const resultFilePath = path.join(resultDir, resultFileName);
            fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2), 'utf-8');
            console.log(`📄 Analysis result written: ${resultFileName}`);

        } catch (error) {
            console.error(`❌ Failed processing ${file}:`, error);
        }
    }
}

main();
