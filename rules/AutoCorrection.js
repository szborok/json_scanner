/**
 * Checks contour operations for required autocorrection pattern.
 * Returns an array of programNames where autocorrection is missing or incorrect.
 * @param {Array} operations - List of operation objects from the JSON file.
 * @param {String} machine - The machine name from the JSON file.
 */
function autoCorrectionCheck_Contour(operations, machine) {
  const errors = [];
  let log = "";

  if (!isAutoCorrectionRequired_Contour({ machine })) {
    log = `not required for machine "${machine}"`;
    return { errors, log };
  }

  // Group operations by programName
  const programs = {};
  operations.forEach((op) => {
    if (!programs[op.programName]) programs[op.programName] = [];
    programs[op.programName].push(op);
  });

  Object.entries(programs).forEach(([progName, ops]) => {
    // Check for either helical drilling or contour finishing filter
    const isHelical = isHelicalDrilling(ops[0]) && isFinishingEndmill(ops[0]);
    const isContour = isContour(ops[0]) && isFinishingEndmill(ops[0]);
    if (!(isHelical || isContour)) return;

    if (ops.length < 6) {
      errors.push(
        `${progName} - not enough operations for autocorrection pattern (found ${ops.length}, expected 6)`
      );
      return;
    }

    // 1. Machining prefinish
    if (!(ops[0].sideStock > 0)) {
      errors.push(
        `${progName} (number: ${ops[0].number}) - Machining prefinish: sideStock is not greater than 0`
      );
      return;
    }
    // 2. Cleaning
    if (!isCleaningTool(ops[1].toolName)) {
      errors.push(
        `${progName} (number: ${ops[1].number}) - Cleaning: tool is not a cleaning tool`
      );
      return;
    }
    // 3. Measure and adjusting
    if (!isTouchProbeTool(ops[2].toolName)) {
      errors.push(
        `${progName} (number: ${ops[2].number}) - Measure and adjusting: tool is not a touch probe tool`
      );
      return;
    }
    if (ops[2].sideStock !== ops[0].sideStock) {
      errors.push(
        `${progName} (number: ${ops[2].number}) - Measure and adjusting: sideStock does not match Machining prefinish`
      );
      return;
    }
    // 4. Machining finish
    if (ops[3].operation !== ops[0].operation) {
      errors.push(
        `${progName} (number: ${ops[3].number}) - Machining finish: operation does not match Machining prefinish`
      );
      return;
    }
    if (!(ops[3].sideStock < ops[0].sideStock)) {
      errors.push(
        `${progName} (number: ${ops[3].number}) - Machining finish: sideStock is not less than Machining prefinish`
      );
      return;
    }
    // 5. Cleaning
    if (!isCleaningTool(ops[4].toolName)) {
      errors.push(
        `${progName} (number: ${ops[4].number}) - Cleaning: tool is not a cleaning tool`
      );
      return;
    }
    // 6. Measuring
    if (!isTouchProbeTool(ops[5].toolName)) {
      errors.push(
        `${progName} (number: ${ops[5].number}) - Measuring: tool is not a touch probe tool`
      );
      return;
    }
    if (ops[5].sideStock !== ops[3].sideStock) {
      errors.push(
        `${progName} (number: ${ops[5].number}) - Measuring: sideStock does not match Machining finish`
      );
      return;
    }
  });

  log =
    errors.length > 0
      ? `error in program(s):\n${errors.join("\n")}`
      : "No error";
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
  return { errors: [], log: "No logic yet" };
}
