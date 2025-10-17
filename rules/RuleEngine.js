class RuleEngine {
  constructor(project) {
    this.project = project;
  }

  runAllChecks() {
    const results = [];

    // Example rule: Check if any finishing mill tool used in compound jobs
    const finishingMillUsed = this.project.compoundJobs.some((job) =>
      job.strategies.some((strategy) => strategy.tool.isFinishingMill)
    );

    results.push({
      rule: "finishingMillUsed",
      passed: finishingMillUsed,
      message: finishingMillUsed
        ? "Finishing mill tool found in strategies."
        : "No finishing mill tool found.",
    });

    // Add more rules here as needed
    // Example: Check if any tool requires M110 in helical drilling but no M110 cycle present (pseudo check)
    // You can customize rules as you want

    return {
      projectName: this.project.name,
      machine: this.project.machine,
      checks: results,
    };
  }
}

module.exports = RuleEngine;
