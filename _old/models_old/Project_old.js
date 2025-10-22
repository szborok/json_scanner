// models/Project.js

class Project {
  constructor(rawData, pathsInfo = {}) {
    this.name = rawData.name || "";
    this.position = rawData.position || "";
    this.originalJsonPath = pathsInfo.originalJsonPath || null;
    this.fixedJsonPath = pathsInfo.fixedJsonPath || null;
    this.resultJsonPath = pathsInfo.resultJsonPath || null;
    this.machine = rawData.machine || "";
    this.compoundJobs = (rawData.programmes || rawData.compoundJobs || []).map(
      (cj) => new CompoundJob(cj)
    );

  }
}

module.exports = Project;
