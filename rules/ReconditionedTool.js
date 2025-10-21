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

  operations.forEach((op) => {
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
          errors.push(
            `${op.programName} (number: ${op.number}) - tool "${op.toolName}" has non-integer diameter (${diameter})`
          );
        }
      }
    }
  });

  return errors;
}
