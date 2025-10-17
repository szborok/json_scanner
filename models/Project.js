class Project {
  constructor(rawData) {
    this.name = rawData.name || "";
    this.position = rawData.position || "";
    this.machine = rawData.machine || "";
    this.compoundJobs = (rawData.programmes || rawData.compoundJobs || []).map(
      (cj) => new CompoundJob(cj)
    );
  }
}
