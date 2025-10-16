const { toolCategories, checkerMachineGroups, ruleGroups } = require('./config');
const { finishingFilter_HelicalDrilling, finishingFilter_Contour, isCleaningTool, isTouchProbeTool, isM110Required4HelicalDrilling, isHelicalDrilling, isFinishingEndmill } = require('./filter');




/**
 * Checks if all operations with the same programName use the same toolName.
 * Returns an array of programNames where this rule is violated.
 * @param {Array} operations - List of operation objects from the JSON file.
 */
function oneToolInOneFile(operations) {
    const errors = [];
    const programTools = {};

    operations.forEach(op => {
        const prog = op.programName;
        const tool = op.toolName;
        if (!programTools[prog]) {
            programTools[prog] = new Set();
        }
        programTools[prog].add(tool);
    });

    Object.entries(programTools).forEach(([prog, tools]) => {
        if (tools.size > 1) {
            errors.push(prog);
        }
    });

    return errors;
}

/**
 * Checks if the total operationTime for gundrill tools in each program exceeds 60 minutes.
 * Returns an array of programNames exceeding the limit.
 * @param {Array} operations - List of operation objects from the JSON file.
 */
function gundrill60MinLimit(operations) {
    const errors = [];
    const gundrillCodes = toolCategories.gundrill;
    const programTimes = {};

    operations.forEach(op => {
        const prog = op.programName;
        const tool = op.toolName;
        if (gundrillCodes.some(code => tool && tool.startsWith(code))) {
            if (!programTimes[prog]) {
                programTimes[prog] = 0;
            }
            programTimes[prog] += op.operationTime || 0;
        }
    });

    Object.entries(programTimes).forEach(([prog, totalTime]) => {
        if (totalTime > 3600) { // 60 minutes in seconds
            errors.push(prog);
        }
    });

    return errors;
}

/**
 * Checks contour operations for required autocorrection pattern.
 * Returns an array of programNames where autocorrection is missing or incorrect.
 * @param {Array} operations - List of operation objects from the JSON file.
 * @param {String} machine - The machine name from the JSON file.
 */
function autoCorrectionCheck_Contour(operations, machine) {
    const errors = [];
    let log = '';

    if (!isAutoCorrectionRequired_Contour({ machine })) {
        log = `not required for machine "${machine}"`;
        return { errors, log };
    }

    // Group operations by programName
    const programs = {};
    operations.forEach(op => {
        if (!programs[op.programName]) programs[op.programName] = [];
        programs[op.programName].push(op);
    });

    Object.entries(programs).forEach(([progName, ops]) => {
        // Check for either helical drilling or contour finishing filter
        const isHelical = isHelicalDrilling(ops[0]) && isFinishingEndmill(ops[0]);
        const isContour = isContour(ops[0]) && isFinishingEndmill(ops[0]);
        if (!(isHelical || isContour)) return;

        if (ops.length < 6) {
            errors.push(`${progName} - not enough operations for autocorrection pattern (found ${ops.length}, expected 6)`);
            return;
        }

        // 1. Machining prefinish
        if (!(ops[0].sideStock > 0)) {
            errors.push(`${progName} (number: ${ops[0].number}) - Machining prefinish: sideStock is not greater than 0`);
            return;
        }
        // 2. Cleaning
        if (!isCleaningTool(ops[1].toolName)) {
            errors.push(`${progName} (number: ${ops[1].number}) - Cleaning: tool is not a cleaning tool`);
            return;
        }
        // 3. Measure and adjusting
        if (!isTouchProbeTool(ops[2].toolName)) {
            errors.push(`${progName} (number: ${ops[2].number}) - Measure and adjusting: tool is not a touch probe tool`);
            return;
        }
        if (ops[2].sideStock !== ops[0].sideStock) {
            errors.push(`${progName} (number: ${ops[2].number}) - Measure and adjusting: sideStock does not match Machining prefinish`);
            return;
        }
        // 4. Machining finish
        if (ops[3].operation !== ops[0].operation) {
            errors.push(`${progName} (number: ${ops[3].number}) - Machining finish: operation does not match Machining prefinish`);
            return;
        }
        if (!(ops[3].sideStock < ops[0].sideStock)) {
            errors.push(`${progName} (number: ${ops[3].number}) - Machining finish: sideStock is not less than Machining prefinish`);
            return;
        }
        // 5. Cleaning
        if (!isCleaningTool(ops[4].toolName)) {
            errors.push(`${progName} (number: ${ops[4].number}) - Cleaning: tool is not a cleaning tool`);
            return;
        }
        // 6. Measuring
        if (!isTouchProbeTool(ops[5].toolName)) {
            errors.push(`${progName} (number: ${ops[5].number}) - Measuring: tool is not a touch probe tool`);
            return;
        }
        if (ops[5].sideStock !== ops[3].sideStock) {
            errors.push(`${progName} (number: ${ops[5].number}) - Measuring: sideStock does not match Machining finish`);
            return;
        }
    });

    log = errors.length > 0
        ? `error in program(s):\n${errors.join('\n')}`
        : 'No error';
    return { errors, log };
}

/**
 * Placeholder for plane auto correction check.
 * Returns an empty array.
 * @param {Array} operations - List of operation objects from the JSON file.
 * @param {String} machine - The machine name from the JSON file.
 */
function autoCorrectionCheck_Plane(operations, machine) {
    // Only return the log message, not the check name twice
    return { errors: [], log: 'No logic yet' };
}

/**
 * Checks that on DMU 65 monoblock, no reconditioned endmill finish or roughing tools are used.
 * Reconditioned means the diameter is not a full integer (e.g., D6.6 is not allowed, D7 is allowed).
 * Returns an array of errors with programName and toolName if violation is found.
 * @param {Array} operations - List of operation objects from the JSON file.
 * @param {String} machine - The machine name from the JSON file.
 */
function noReconditionedEndmill(operations, machine) {
    const errors = [];
    // Adjust machine name as needed to match your config.js
    if (!ruleGroups.noReconditionedEndmill.includes(machine)) return errors;

    operations.forEach(op => {
        // Check only endmill finish and roughing tools
        const isFinish = toolCategories.endmill_finish.includes(op.toolName);
        const isRoughing = toolCategories.endmill_roughing.includes(op.toolName);
        if (isFinish || isRoughing) {
            // Extract diameter from toolName, expects format like 'D7' or 'D6.6'
            const match = op.toolName.match(/D(\d+(\.\d+)?)/);
            if (match) {
                const diameter = match[1];
                // If diameter is not an integer, it's reconditioned
                if (!/^\d+$/.test(diameter)) {
                    errors.push(`${op.programName} (number: ${op.number}) - tool "${op.toolName}" has non-integer diameter (${diameter})`);
                }
            }
        }
    });

    return errors;
}

function checkM110(operations) {
    const errors = [];
    const listOfM110RequirePrograms = new Set();

    operations.forEach(op => {
        if (isM110Required4HelicalDrilling(op)) {
            listOfM110RequirePrograms.add(op.programName);
        };
    })    

    

    return errors;
}

//TODO - Testvérszerszám
//TODO - NA FCS LT kiemelve
//TODO - Szerszámgép max fordulat ellenőrzés
//TODO - NC és tagozódás számozás ellenőrzés


module.exports = {
    oneToolInOneFile,
    gundrill60MinLimit,
    autoCorrectionCheck_Contour,
    autoCorrectionCheck_Plane,
    noReconditionedEndmill,
};