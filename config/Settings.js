// path: config/Settings.js
/**
 * Global application settings.
 * Defines system mode, root paths, and configuration values.
 * Used by core modules (Executor, Scanner, Project, etc.)
 */

const path = require("path");

const Settings = {
  // Switch between modes
  autorun: true, // true = automatic scanning and execution, false = manual mode

  // Base paths
  dataRoot: path.join(__dirname, "..", "data"),
  testPathAuto: path.join(__dirname, "..", "data", "testPathHumming_auto"),
  testPathManual: path.join(__dirname, "..", "data", "testPathOne_manual"),

  // When running in test mode, this folder is used
  useTestData: true,

  // Extensions and file naming
  jsonExtension: ".json",
  fixedSuffix: "BRK_fixed",
  resultSuffix: "BRK_result",

  // Timeouts and intervals
  scanIntervalMs: 5000, // How often the autorun scanner checks for new JSONs
  logLevel: "info", // can be: 'debug', 'info', 'warn', 'error'

  // Experimental flags
  enableDetailedLogging: true,
};

module.exports = Settings;
