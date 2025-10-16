const Tool = require('./Tool');

class Project {
    constructor(rawData) {
        this.name = rawData.name || '';
        this.position = rawData.position || '';
        this.machine = rawData.machine || '';
        this.compoundJobs = (rawData.programmes || rawData.compoundJobs || []).map(cj => new CompoundJob(cj));
    }

    toJSON() {
        return {
            name: this.name,
            position: this.position,
            machine: this.machine,
            compoundJobs: this.compoundJobs.map(cj => cj.toJSON()),
        };
    }
}

class CompoundJob {
    constructor(rawData) {
        this.id = rawData.id || '';
        this.jobName = rawData.programmeName || rawData.jobName || '';
        this.strategies = (rawData.strategies || []).map(s => new Strategy(s));
    }

    toJSON() {
        return {
            id: this.id,
            jobName: this.jobName,
            strategies: this.strategies.map(s => s.toJSON()),
        };
    }
}

class Strategy {
    constructor(rawData) {
        this.id = rawData.id || '';
        this.programName = rawData.programName || '';
        this.strategyType = rawData.strategyType || '';
        this.tool = new Tool(rawData.tool || {});
        this.sideStock = rawData.sideStock || '';
        this.floorStock = rawData.floorStock || '';
        this.runningTime = rawData.runningTime || 0;
    }

    toJSON() {
        return {
            id: this.id,
            programName: this.programName,
            strategyType: this.strategyType,
            tool: this.tool.toJSON(),
            sideStock: this.sideStock,
            floorStock: this.floorStock,
            runningTime: this.runningTime,
        };
    }
}

module.exports = Project;
