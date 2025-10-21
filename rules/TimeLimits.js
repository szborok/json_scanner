/**
 * Checks if the total operationTime for gundrill tools in each program exceeds 60 minutes.
 * Returns an array of programNames exceeding the limit.
 * @param {Array} operations - List of operation objects from the JSON file.
 */
function gundrill60MinLimit(operations) {
  const errors = [];
  const gundrillCodes = toolCategories.gundrill;
  const programTimes = {};

  operations.forEach((op) => {
    const prog = op.programName;
    const tool = op.toolName;
    if (gundrillCodes.some((code) => tool && tool.startsWith(code))) {
      if (!programTimes[prog]) {
        programTimes[prog] = 0;
      }
      programTimes[prog] += op.operationTime || 0;
    }
  });

  Object.entries(programTimes).forEach(([prog, totalTime]) => {
    if (totalTime > 3600) {
      // 60 minutes in seconds
      errors.push(prog);
    }
  });

  return errors;
}
