// path: core/analyzer/Analyzer.js
/**
 * The Analyzer is responsible for loading, validating, and fixing JSON files
 * before they are processed by the rule engine.
 * It outputs “fixed” JSON files beside the originals.
 */

const fs = require("fs");
const path = require("path");
const Settings = require("../../config/Settings");
const { logInfo, logWarn, logError } = require("../../utils/Logger");
const { readFileSafe, writeJsonSafe } = require("../../utils/FileUtils");

class Analyzer {
  constructor() {}

  /**
   * Process all JSON files in a given project.
   * @param {Project} project - The project to analyze.
   */
  analyzeProject(project) {
    logInfo(`Analyzing project "${project.name}"...`);
    project.fixedFiles = [];

    for (const jsonPath of project.jsonFiles) {
      const fixedPath = project.getFixedFilePath(jsonPath);
      const fixedData = this.fixJson(jsonPath);

      if (fixedData) {
        writeJsonSafe(fixedPath, fixedData);
        project.fixedFiles.push(fixedPath);
        logInfo(`✓ Fixed JSON saved: ${path.basename(fixedPath)}`);
      } else {
        logWarn(`⚠ Skipped invalid JSON: ${path.basename(jsonPath)}`);
      }
    }

    return project;
  }

  /**
   * Attempts to read and parse a JSON file.
   * If invalid, it tries simple fixes (UTF-8 encoding, trailing commas, etc.)
   * @param {string} jsonPath
   * @returns {object|null}
   */
  fixJson(jsonPath) {
    try {
      let content = readFileSafe(jsonPath);
      if (!content) return null;

      // Try to parse first
      try {
        return JSON.parse(content);
      } catch (e) {
        logWarn(`Trying to auto-fix invalid JSON: ${path.basename(jsonPath)}`);
      }

      // Basic auto-fixes
      content = content
        .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
        .replace(/[\u0000-\u0019]+/g, ""); // remove control characters

      try {
        return JSON.parse(content);
      } catch (e) {
        logError(
          `Failed to fix JSON: ${path.basename(jsonPath)} (${e.message})`
        );
        return null;
      }
    } catch (err) {
      logError(`Error reading JSON file: ${err.message}`);
      return null;
    }
  }
}

module.exports = Analyzer;
