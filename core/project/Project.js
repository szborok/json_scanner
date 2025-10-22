// path: core/project/Project.js
/**
 * Represents a single machining project.
 * Handles locating JSON/NC files, creating fixed/result file paths,
 * and managing project-level metadata.
 */

const fs = require("fs");
const path = require("path");
const Settings = require("../../config/Settings");
const { logInfo, logError } = require("../../utils/Logger");
const { ensureDirSync, getJsonFilesInDir } = require("../../utils/FileUtils");

class Project {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.name = path.basename(projectPath);
    this.machineFolders = [];
    this.jsonFiles = [];
    this.fixedFiles = [];
    this.resultFiles = [];
    this.status = "initialized";
  }

  /**
   * Scans subdirectories to find machine folders and JSON files.
   */
  initialize() {
    try {
      const subdirs = fs.readdirSync(this.projectPath, { withFileTypes: true });
      for (const dir of subdirs) {
        if (dir.isDirectory()) {
          const machineFolder = path.join(this.projectPath, dir.name);
          const jsonFiles = getJsonFilesInDir(machineFolder);
          if (jsonFiles.length > 0) {
            this.machineFolders.push(machineFolder);
            jsonFiles.forEach((file) => this.jsonFiles.push(file));
          }
        }
      }
      this.status = "ready";
      logInfo(
        `Initialized project "${this.name}" with ${this.jsonFiles.length} JSON(s).`
      );
    } catch (err) {
      this.status = "error";
      logError(`Failed to initialize project ${this.name}: ${err.message}`);
    }
  }

  /**
   * Generates the fixed JSON filename for a given original JSON file.
   */
  getFixedFilePath(originalJsonPath) {
    const dir = path.dirname(originalJsonPath);
    const base = path.basename(originalJsonPath, Settings.jsonExtension);
    return path.join(
      dir,
      `${base}_${Settings.fixedSuffix}${Settings.jsonExtension}`
    );
  }

  /**
   * Generates the result JSON filename for a given original JSON file.
   */
  getResultFilePath(originalJsonPath) {
    const dir = path.dirname(originalJsonPath);
    const base = path.basename(originalJsonPath, Settings.jsonExtension);
    return path.join(
      dir,
      `${base}_${Settings.resultSuffix}${Settings.jsonExtension}`
    );
  }

  /**
   * Ensures that folders for fixed and result files exist.
   */
  prepareFolders() {
    this.jsonFiles.forEach((file) => {
      const dir = path.dirname(file);
      ensureDirSync(dir);
    });
  }

  /**
   * Returns a summary of this project.
   */
  getSummary() {
    return {
      name: this.name,
      machineCount: this.machineFolders.length,
      jsonCount: this.jsonFiles.length,
      status: this.status,
    };
  }
}

module.exports = Project;
