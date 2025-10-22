// path: core/executor/Executor.js
/**
 * The Executor orchestrates the full process:
 * scanning, analyzing, applying rules, and writing results.
 */

const Settings = require("../../config/Settings");
const { logInfo, logWarn, logError } = require("../../utils/Logger");
const Scanner = require("../scanner/Scanner");
const Analyzer = require("../analyzer/Analyzer");
const RuleEngine = require("./RuleEngine");
const Results = require("./Results");

class Executor {
  constructor() {
    this.scanner = new Scanner();
    this.analyzer = new Analyzer();
    this.ruleEngine = new RuleEngine();
    this.results = new Results();
    this.isRunning = false;
    this.manualQueue = [];
  }

  /**
   * Start the entire process (autorun or manual).
   */
  async start() {
    if (this.isRunning) {
      logWarn("Executor already running.");
      return;
    }

    this.isRunning = true;
    logInfo(`Executor started (${Settings.autorun ? "AUTO" : "MANUAL"} mode).`);

    this.scanner.start();

    if (Settings.autorun) {
      await this.runAutorunCycle();
    }
  }

  /**
   * Runs continuously when autorun is true.
   * Waits for new projects and processes them sequentially.
   */
  async runAutorunCycle() {
    while (this.isRunning && Settings.autorun) {
      const projects = this.scanner.getProjects();

      for (const project of projects) {
        if (project.status === "ready") {
          await this.processProject(project);
        }
      }

      // Wait before scanning again
      await new Promise((res) => setTimeout(res, Settings.scanIntervalMs));
    }
  }

  /**
   * Process a project: analyze -> rule check -> results.
   */
  async processProject(project) {
    try {
      logInfo(`Processing project: ${project.name}`);

      this.analyzer.analyzeProject(project);
      const ruleResults = this.ruleEngine.runChecks(project);
      this.results.saveProjectResults(project, ruleResults);

      logInfo(`Project completed: ${project.name}`);
      project.status = "completed";
    } catch (err) {
      logError(`Project processing failed: ${err.message}`);
      project.status = "failed";
    }
  }

  /**
   * Queue a manual project for execution.
   * Will pause autorun after the current project.
   */
  async runManualProject(projectPath) {
    logInfo(`Manual run requested for: ${projectPath}`);

    if (Settings.autorun) {
      logWarn("Autorun active — will pause after current project.");
      Settings.autorun = false;
    }

    this.manualQueue.push(projectPath);

    // Wait for any running project to finish
    while (this.isRunning) await new Promise((res) => setTimeout(res, 1000));

    const project = this.scanner.manualScan(projectPath);
    await this.processProject(project);

    logInfo("Manual project finished. Resuming autorun...");
    Settings.autorun = true;
    await this.start();
  }

  /**
   * Stop after current work is done.
   */
  stop() {
    logWarn("Executor stop requested.");
    this.isRunning = false;
    this.scanner.stop();
  }
}

module.exports = Executor;
