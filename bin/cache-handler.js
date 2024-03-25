const fs = require("fs");
const path = require("path");

const CACHE_FILE_PATH = path.join(__dirname, "../cached-data.json");

function readCache() {
  try {
    const data = fs.readFileSync(CACHE_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}

function writeCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch (error) {
    console.error("Error:", error);
  }
}

function getCache(key) {
  const cache = readCache();
  return cache[key];
}

function setCache(key, data) {
  const cache = readCache();
  cache[key] = data;
  writeCache(cache);
}

module.exports = { getCache, setCache };
