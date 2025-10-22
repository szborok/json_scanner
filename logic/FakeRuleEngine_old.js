//logic/FakeRuleEngine.js

function fakeAnalyzeJson(json) {
  return {
    status: 'OK',
    toolCount: Array.isArray(json.tools) ? json.tools.length : 0,
    timestamp: new Date().toISOString(),
    notes: 'This is a mock analysis result.'
  };
}

module.exports = { fakeAnalyzeJson };

