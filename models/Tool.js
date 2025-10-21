// Tool.js
const ToolCategory = require("./ToolCategory");

class Tool {
  constructor(name) {
    this.name = name;
    this.category = ToolCategory.getToolCategory(name);
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
}

module.exports = Tool;
