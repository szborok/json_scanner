// path: utils/Logger.js
/**
 * Simple color-coded logger utility with timestamps.
 * Used for consistent terminal output across modules.
 */

const chalk = require("chalk");
const Settings = require("../config/Settings");

// Helper to format timestamp
function timeStamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

function log(level, message) {
  const ts = timeStamp();
  if (!shouldLog(level)) return;

  const formatted =
    {
      debug: chalk.gray(`[${ts}] [DEBUG] ${message}`),
      info: chalk.cyan(`[${ts}] [INFO] ${message}`),
      warn: chalk.yellow(`[${ts}] [WARN] ${message}`),
      error: chalk.red(`[${ts}] [ERROR] ${message}`),
    }[level] || message;

  console.log(formatted);
}

// Respect log level settings
function shouldLog(level) {
  const order = ["debug", "info", "warn", "error"];
  const minIndex = order.indexOf(Settings.logLevel);
  const msgIndex = order.indexOf(level);
  return msgIndex >= minIndex;
}

module.exports = {
  debug: (msg) => log("debug", msg),
  info: (msg) => log("info", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
};
