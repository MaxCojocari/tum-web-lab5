const { setCache, getCache } = require("./cache-handler");
const { makeHttpsRequest } = require("./request-handler");
const { splitResBody } = require("./response-handler");

require("dotenv").config();

function normalizeSearchInput(input) {
  input = input.toLowerCase();
  const withoutPunctuation = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  const tokens = withoutPunctuation.split(/\s+/);

  let query = tokens[0];
  for (let i = 1; i < tokens.length; ++i) {
    query += "+" + tokens[i];
  }

  return query;
}

async function makeSearchCall(query) {
  const normalizedQuery = normalizeSearchInput(query);
  const path = `/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${normalizedQuery}`;

  const cached = getCache(normalizedQuery);

  let bodyRes;
  if (cached) {
    bodyRes = cached;
  } else {
    const res = await makeHttpsRequest(process.env.API_URL, undefined, path);
    bodyRes = JSON.parse(splitResBody(res));
    setCache(normalizedQuery, bodyRes);
  }

  const items = bodyRes["items"];

  for (let item of items) {
    console.log(item.title);
    console.log(item.link);
    console.log(item.snippet);
    console.log("\n");
  }
}

module.exports = { normalizeSearchInput, makeSearchCall };
