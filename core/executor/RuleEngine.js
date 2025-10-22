// path: core/executor/RuleEngine.js
/**
 * RuleEngine dynamically loads and executes rule modules from /rules.
 * Each rule exports a "run" function that receives (project, report).
 */

const fs = require("fs");
const path = require("path");
const { logInfo, logWarn, logError } = require("../../utils/Logger");
const Settings = require("../../config/Settings");

class RuleEngine {
  constructor() {
    this.rules = [];
    this.rulesPath = path.join(__dirname, "..", "..", "rules");
    this.loadRules();
  }

  /**
   * Loads all rule files from /rules directory.
   */
  loadRules() {
    try {
      const files = fs.readdirSync(this.rulesPath);

      this.rules = files
        .filter((file) => file.endsWith(".js"))
        .map((file) => {
          const fullPath = path.join(this.rulesPath, file);
          delete require.cache[require.resolve(fullPath)];
          const ruleModule = require(fullPath);
          return {
            name: path.basename(file, ".js"),
            run: ruleModule.run || (() => ({})),
          };
        });

      logInfo(`Loaded ${this.rules.length} rules from /rules`);
    } catch (err) {
      logError(`Failed to load rules: ${err.message}`);
    }
  }

  /**
   * Executes all loaded rules on the given project.
   * Returns a detailed result summary.
   */
  runChecks(project) {
    const report = {
      projectName: project.name,
      jsonPath: project.jsonPath,
      results: [],
      summary: {
        passed: 0,
        warnings: 0,
        errors: 0,
      },
    };

    for (const rule of this.rules) {
      try {
        const result = rule.run(project, report) || {};

        const entry = {
          rule: rule.name,
          status: result.status || "ok",
          message: result.message || "No message provided",
        };

        // Update summary counts
        if (entry.status === "error") report.summary.errors++;
        else if (entry.status === "warning") report.summary.warnings++;
        else report.summary.passed++;

        report.results.push(entry);
        logInfo(
          `[${rule.name}] ${entry.status.toUpperCase()}: ${entry.message}`
        );
      } catch (err) {
        logError(`Rule ${rule.name} crashed: ${err.message}`);
        report.results.push({
          rule: rule.name,
          status: "error",
          message: `Exception: ${err.message}`,
        });
        report.summary.errors++;
      }
    }

    return report;
  }
}

module.exports = RuleEngine;
