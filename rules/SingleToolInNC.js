/**
 * Checks if all operations with the same programName use the same toolName.
 * Returns an array of programNames where this rule is violated.
 * @param {Array} operations - List of operation objects from the JSON file.
 */
function singleToolInNC(operations) {
  const errors = [];
  const programTools = {};

  operations.forEach((op) => {
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
