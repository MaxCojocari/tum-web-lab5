#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { makeHttpsRequest } = require("./request-handler");
const { makeSearchCall } = require("./search-api");
const { parseHtml } = require("./response-handler");

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

async function main() {
  if (Object.keys(argv).length <= 2) {
    yargs.showHelp();
  } else if (argv.u) {
    const urlString = argv.url;
    const url = new URL(urlString);
    const domain = url.hostname;
    const path = url.pathname;
    const res = await makeHttpsRequest(domain, undefined, path);
    // console.log(res);
    console.log(parseHtml(res));
  } else if (argv.s) {
    let searchQuery = argv.s;
    for (let queryParam of argv._) {
      searchQuery += " " + queryParam;
    }
    makeSearchCall(searchQuery);
  } else if (!argv.u && !argv.s) {
    console.log("You must provide a valid command!\n");
    yargs.showHelp();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
