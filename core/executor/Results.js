// path: core/executor/Results.js
/**
 * Handles saving of rule check results and summaries.
 * Creates a result file beside the project's JSON file.
 */

const fs = require("fs");
const path = require("path");
const { logInfo, logError } = require("../../utils/Logger");
const Settings = require("../../config/Settings");

class Results {
  /**
   * Saves a rule engine report to disk beside the original JSON.
   * The file name format: <original_name>_BRK_result.json
   */
  static saveReport(project, report) {
    try {
      const dir = path.dirname(project.jsonPath);
      const originalName = path.basename(
        project.jsonPath,
        Settings.jsonExtension
      );
      const resultName = `${originalName}_${Settings.resultSuffix}${Settings.jsonExtension}`;
      const resultPath = path.join(dir, resultName);

      fs.writeFileSync(resultPath, JSON.stringify(report, null, 2), "utf8");

      logInfo(`✅ Result file saved: ${resultPath}`);
      return resultPath;
    } catch (err) {
      logError(
        `❌ Failed to save result file for ${project.name}: ${err.message}`
      );
      return null;
    }
  }

  /**
   * Prints a readable summary of the report to the console.
   */
  static printSummary(report) {
    const { summary, projectName } = report;

    logInfo(`\n📋 Summary for ${projectName}`);
    logInfo(`  Passed:  ${summary.passed}`);
    logInfo(`  Warnings: ${summary.warnings}`);
    logInfo(`  Errors:   ${summary.errors}`);

    if (summary.errors > 0) {
      logError(`  ❌ Project has errors.`);
    } else if (summary.warnings > 0) {
      logInfo(`  ⚠️ Project has warnings.`);
    } else {
      logInfo(`  ✅ All checks passed successfully.`);
    }
  }
}

module.exports = Results;
