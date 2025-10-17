// models/Job.js
const Tool = require("./Tool");

class Job {
  constructor(data) {
    this.id = data.number;
    this.programName = data.programName;
    this.type = data.operation;
    this.sideStock = data.sideStock;
    this.floorStock = data.floorStock;
    this.runningTime = data.operationTime;
    this.tool = new Tool(data.toolName);
  }
}

module.exports = Job;
