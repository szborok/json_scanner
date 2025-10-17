// models/CompoundJob.js
const Job = require("./Job");

class CompoundJob {
  constructor(name, strategiesData) {
    this.name = name;
    this.strategies = strategiesData.map((s) => new Job(s));
  }

  get totalRuntime() {
    return this.strategies.reduce((sum, s) => sum + s.runningTime, 0);
  }

  get usedTools() {
    const tools = this.strategies.map((s) => s.tool.name);
    return [...new Set(tools)];
  }
}

module.exports = CompoundJob;
