// path: core/scanner/Scanner.js
/**
 * Handles automatic or manual scanning of project directories.
 * Detects new JSON files and initializes Project instances.
 */

const fs = require("fs");
const path = require("path");
const Settings = require("../../config/Settings");
const { logInfo, logWarn, logError } = require("../../utils/Logger");
const { getDirectories } = require("../../utils/FileUtils");
const Project = require("../project/Project");

class Scanner {
  constructor() {
    this.projects = [];
    this.running = false;
    this.interval = null;
  }

  /**
   * Start the scanner.
   * If autorun is enabled, periodically scans for projects.
   */
  start() {
    this.running = true;
    logInfo(`Scanner started in ${Settings.autorun ? "AUTO" : "MANUAL"} mode`);

    if (Settings.autorun) {
      this.scanOnce(); // Run first scan immediately
      this.interval = setInterval(() => {
        if (this.running) this.scanOnce();
      }, Settings.scanIntervalMs);
    }
  }

  /**
   * Stop scanning after the current cycle.
   */
  stop() {
    this.running = false;
    if (this.interval) clearInterval(this.interval);
    logWarn("Scanner stopped after finishing current project.");
  }

  /**
   * Perform one scan of the data directory.
   * Detects new project folders matching the naming pattern.
   */
  scanOnce() {
    try {
      const root = Settings.useTestData
        ? Settings.testPathAuto
        : Settings.dataRoot;

      const dirs = getDirectories(root);
      const projectDirs = dirs.filter((name) =>
        /^W\d{4}[A-Z]{2}\d{2,}[A-Z]*$/.test(name)
      );

      if (projectDirs.length === 0) {
        logWarn("No valid project folders found.");
        return;
      }

      logInfo(`Found ${projectDirs.length} project(s) to scan.`);

      projectDirs.forEach((dirName) => {
        const fullPath = path.join(root, dirName);
        const project = new Project(fullPath);
        project.initialize();
        this.projects.push(project);
      });
    } catch (err) {
      logError(`Scanner failed: ${err.message}`);
    }
  }

  /**
   * Trigger a manual scan for a single path (used when autorun is off).
   * @param {string} projectPath - Path to the project to scan.
   */
  manualScan(projectPath) {
    try {
      const project = new Project(projectPath);
      project.initialize();
      this.projects.push(project);
      logInfo(`Manually added project "${project.name}"`);
    } catch (err) {
      logError(`Manual scan failed: ${err.message}`);
    }
  }

  /**
   * Returns all discovered projects.
   */
  getProjects() {
    return this.projects;
  }
}

module.exports = Scanner;
