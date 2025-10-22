// path: utils/FileUtils.js
/**
 * File utility functions for reading, writing, and managing JSON and text files.
 * All file operations are wrapped in try/catch with proper logging.
 */

const fs = require("fs");
const path = require("path");
const Logger = require("./Logger");
const Settings = require("../config/Settings");

const FileUtils = {
  /**
   * Reads and parses a JSON file safely.
   * @param {string} filePath - Path to the JSON file.
   * @returns {object|null} Parsed JSON or null on error.
   */
  readJSON(filePath) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      Logger.error(`Failed to read JSON: ${filePath} -> ${err.message}`);
      return null;
    }
  },

  /**
   * Writes a JSON file safely, creating directories if needed.
   * @param {string} filePath - Path to the file.
   * @param {object} data - Object to save.
   */
  writeJSON(filePath, data) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      Logger.info(`Saved JSON file: ${filePath}`);
    } catch (err) {
      Logger.error(`Failed to write JSON: ${filePath} -> ${err.message}`);
    }
  },

  /**
   * Writes plain text safely (used for logs or reports).
   * @param {string} filePath
   * @param {string} text
   */
  writeText(filePath, text) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, text, "utf-8");
      Logger.info(`Saved text file: ${filePath}`);
    } catch (err) {
      Logger.error(`Failed to write text: ${filePath} -> ${err.message}`);
    }
  },

  /**
   * Creates a filename with a suffix (e.g., BRK_fixed or BRK_result)
   * based on the original JSON filename.
   * @param {string} originalPath - Path to the original JSON file.
   * @param {string} suffix - e.g., "BRK_fixed"
   * @returns {string} Full path with new filename.
   */
  makeFileName(originalPath, suffix) {
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    const newName = `${base}_${suffix}${ext}`;
    return path.join(dir, newName);
  },

  /**
   * Checks if a file exists.
   * @param {string} filePath
   * @returns {boolean}
   */
  exists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  },
};

module.exports = FileUtils;
