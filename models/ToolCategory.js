class ToolCategory {
  static categories = {
    gundrill: {
      matchType: "partial",
      tools: [
        "GUH-1865",
        "GUH-3032",
        "GUH-3033",
        "GUH-3035",
        "GUH-5639",
        "GUH-5640",
        "GUH-5641",
        "GUH-5688",
        "GUH-5691",
        "GUH-49298",
        "TUN-AF",
        "TOO-AF",
      ],
    },
    endmill_finish: {
      matchType: "partial",
      tools: ["FRA-P15250", "FRA-P15251", "FRA-P15254", "FRA-P8521"],
    },
    endmill_roughing: {
      matchType: "partial",
      tools: ["GUH-6736", "GUH-6961", "FRA-P8420"],
    },
    jjTools: {
      matchType: "partial",
      tools: ["JJ"],
    },
    TGT: {
      matchType: "partial",
      tools: ["TGT"],
    },
    Xfeed: {
      matchType: "partial",
      tools: ["FRA-X7600", "FRA-X7604", "FRA-X7620", "FRA-X7624"],
    },
    cleaning: {
      matchType: "exact",
      tools: ["G12R6-tisztito_H63Z12L120X"],
    },
    touchprobe: {
      matchType: "exact",
      tools: [
        "DMG-TAP75_H63-Renishaw-taszter-HSC75",
        "DMG-TAP85_H63TASZTER-DMU85",
        "DMG-TAP100P_H63TASZTER-DMU100P",
        "DMG-TAP100P4_H63-Renishaw-taszter-DMU100P4",
        "DMG-TAP105_H63TASZTER-DMC105",
        "DMG-TAP-Trimill_H100TASZTER-Trimill",
        "DMG-TAP65_H63TASZTER-DMU65",
      ],
    },
  };

  static requiresM110Categories = ["endmill_finish", "jjTools", "TGT", "Xfeed"];

  static requiresM110(toolName) {
    return this.getToolCategories(toolName).some((cat) =>
      this.requiresM110Categories.includes(cat)
    );
  }

  static getToolCategories(toolName) {
    const matched = [];

    for (const [category, { matchType, tools }] of Object.entries(
      this.categories
    )) {
      const found = tools.some((t) =>
        matchType === "exact" ? t === toolName : toolName.includes(t)
      );

      if (found) matched.push(category);
    }

    return matched;
  }

  static belongsToCategory(toolName, categoryName) {
    const category = this.categories[categoryName];
    if (!category) return false;

    return category.tools.some((t) =>
      category.matchType === "exact" ? t === toolName : toolName.includes(t)
    );
  }

  static isCleaningTool(toolName) {
    return this.belongsToCategory(toolName, "cleaning");
  }

  static isTouchProbe(toolName) {
    return this.belongsToCategory(toolName, "touchprobe");
  }
}

module.exports = ToolCategory;
