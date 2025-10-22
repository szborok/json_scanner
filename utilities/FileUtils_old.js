// utilities/FileUtils.js

const fs = require("fs");
const path = require("path");
const readline = require("readline");


// Replace all "NaN" strings in a JSON structure with null

function fixJson(data) {
    if (Array.isArray(data)) {
        return data.map(fixJson);
    } else if (data !== null && typeof data === 'object') {
        const fixedObj = {};
        for (const key in data) {
            fixedObj[key] = fixJson(data[key]);
        }
        return fixedObj;
    } else if (typeof data === 'string' && data.trim().toLowerCase() === 'nan') {
        return null;
    } else {
        return data;
    }
}

module.exports = { fixJson };