// Tool.js
const ToolCategory = require("./ToolCategory");

class Tool {
  constructor(name) {
    this.name = name;
  }

  isFinishingEndmill() {
    return ToolCategory.belongsToCategory(this.name, "endmill_finish");
  }

  isM110Required(operation) {
    // operation is passed so we can check if it's helical drilling + tool requires M110
    if (
      operation.operation !== "openMIND Simple Helical Drilling Cycle" &&
      operation.operation !== "openMIND 2D Contour Milling Cycle"
    ) {
      return false;
    }
    return ToolCategory.requiresM110(this.name);
  }

  isCleaningTool() {
    return ToolCategory.belongsToCategory(this.name, "cleaning");
  }

  isTouchProbeTool() {
    return ToolCategory.belongsToCategory(this.name, "touchprobe");
  }

  // Add any other question methods here as needed...
}

module.exports = Tool;
