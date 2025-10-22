class ToolCategory {
  static categories = {
    Gundrill: {
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
    Endmill_finish: {
      matchType: "partial",
      tools: ["FRA-P15250", "FRA-P15251", "FRA-P15254", "FRA-P8521"],
    },
    Endmill_roughing: {
      matchType: "partial",
      tools: ["GUH-6736", "GUH-6961", "FRA-P8420"],
    },
    JJTools: {
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
    Cleaning: {
      matchType: "exact",
      tools: ["G12R6-tisztito_H63Z12L120X"],
    },
    Touchprobe: {
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

  getToolCategory(toolName) {
    for (const [category, data] of Object.entries(ToolCategory.categories)) {
      for (const tool of data.tools) {
        if (
          (data.matchType === "partial" && toolName.includes(tool)) ||
          (data.matchType === "exact" && toolName === tool)
        ) {
          return category.toLowerCase();
        }
      }
    }
    return null;
  }
}

module.exports = ToolCategory;
