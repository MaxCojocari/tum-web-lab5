#!/usr/bin/env node

const yargs = require("yargs");
const { parse } = require("node-html-parser");
const { makeHttpRequest, makeHttpsRequest } = require("./request-handlers");
const { hideBin } = require("yargs/helpers");

require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.removeAllListeners("warning");

yargs(hideBin(process.argv))
  .scriptName("go2web")
  .usage("$0 -u <URL>\n$0 -s <search-term>")
  .option("u", {
    alias: "url",
    describe:
      "Make an HTTP request to the specified URL and print the response",
    type: "string",
    requiresArg: true,
  })
  .option("s", {
    alias: "search",
    describe:
      "Make an HTTP request to search the term and print top 10 results",
    type: "string",
    requiresArg: true,
  })
  .help("h")
  .alias("h", "help")
  .demandCommand(1, "You need at least one command before moving on").argv;

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

function splitResBody(response) {
  const separator = "\r\n\r\n";
  const separatorIndex = response.indexOf(separator);
  if (separatorIndex === -1) {
    throw new Error("The separator was not found in the response.");
  }
  const bodyPart = response.substring(separatorIndex + separator.length);
  return bodyPart;
}

function parseHtml(response) {
  const root = parse(splitResBody(response));
  root.querySelectorAll("script, style").forEach((node) => node.remove());
  return root.structuredText.replace(/(<([^>]+)>)/gi, "");
}

async function makeSearchCall(query) {
  const normalizedQuery = normalizeSearchInput(query);
  const url = `www.googleapis.com`;
  const path = `/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${normalizedQuery}`;
  const res = await makeHttpsRequest(url, undefined, path);
  const bodyRes = JSON.parse(splitResBody(res));
  const items = bodyRes["items"];
  for (let item of items) {
    console.log(item.title);
    console.log(item.link);
    console.log(item.snippet);
    console.log("\r\n\r\n");
  }
}

async function main() {
  //   const query = "Maxim Cojocari, the renowned artist!";
  //   await makeSearchCall(query);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
