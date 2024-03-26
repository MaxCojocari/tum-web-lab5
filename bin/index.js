#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { makeHttpsRequest } = require("./request-handler");
const { makeSearchCall } = require("./search-api");
const {
  parseHtml,
  splitResBody,
  getContentTypeFromResponse,
} = require("./response-handler");
const { getCache, setCache } = require("./cache-handler");

require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.removeAllListeners("warning");

const argv = yargs(hideBin(process.argv))
  .scriptName("go2web")
  .usage("Usage: $0 -u <URL> or $0 -s <search-term>")
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
  .help()
  .alias("help", "h")
  .parse();

async function handleUrlCommand() {
  const urlString = argv.u;
  const cached = getCache(urlString);

  let res;
  if (cached) {
    res = cached;
  } else {
    const url = new URL(urlString);
    const domain = url.hostname;
    const path = url.pathname + url.search;
    res = await makeHttpsRequest(domain, undefined, path);
    setCache(urlString, res);
  }

  const header = splitResBody(res).header;
  const contentType = getContentTypeFromResponse(header);

  if (contentType.includes("application/json")) {
    const json = splitResBody(res).body;
    console.log(JSON.parse(json));
  } else if (contentType.includes("text/html")) {
    console.log(parseHtml(res));
  } else {
    console.log(res);
  }
}

async function handleSearchCommand() {
  let searchQuery = argv.s;
  for (let queryParam of argv._) {
    searchQuery += " " + queryParam;
  }
  await makeSearchCall(searchQuery);
}

async function main() {
  if (Object.keys(argv).length <= 2) {
    yargs.showHelp();
  } else if (argv.u) {
    await handleUrlCommand();
  } else if (argv.s) {
    await handleSearchCommand();
  } else if (!argv.u && !argv.s) {
    console.log("You must provide a valid command!\n");
    yargs.showHelp();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
