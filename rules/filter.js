const { toolCategories, ruleGroups } = require("./config");

function isHelicalDrilling(operation) {
  return operation.operation === "openMIND Simple Helical Drilling Cycle";
}

function is2DContour(operation) {
  return operation.operation === "2D Contour";
}

function isFinishingEndmill(operation) {
  return toolCategories.endmill_finish.includes(operation.toolName);
}

function isM110Required4HelicalDrilling(operation) {
  return (
    isHelicalDrilling(operation) &&
    toolCategories.requireM110forHelicalDrilling.includes(operation.toolName)
  );
}

function isCleaningTool(toolName) {
  return toolCategories.cleaning.includes(toolName);
}

function isTouchProbeTool(toolName) {
  return toolCategories.touchprobe.includes(toolName);
}

function isAutoCorrectionRequired_Contour(operations) {
  return ruleGroups.autoCorrectionRequired_Contour.includes(operations.machine);
}

function isAutoCorrectionRequired_Plane(operations) {
  return ruleGroups.autoCorrectionRequired_Plane.includes(operations.machine);
}

module.exports = {
  isHelicalDrilling,
  is2DContour,
  isFinishingEndmill,
  isM110Required4HelicalDrilling,
  isCleaningTool,
  isTouchProbeTool,
};
