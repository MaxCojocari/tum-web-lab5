const fs = require("fs");
const path = require("path");

const CACHE_FILE_PATH = path.join(__dirname, "../cached-data.json");
const DEFAULT_TTL = 5 * 60 * 1000;

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
  const item = cache[key];
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

function setCache(key, data, ttl) {
  const cache = readCache();

  let expiry;

  if (ttl) {
    expiry = Date.now() + ttl;
  } else {
    expiry = Date.now() + DEFAULT_TTL;
  }

  cache[key] = { data, expiry };
  writeCache(cache);
}

module.exports = { getCache, setCache };
