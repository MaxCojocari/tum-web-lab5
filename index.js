const { parse } = require("node-html-parser");
const { makeHttpRequest, makeHttpsRequest } = require("./request-handlers");

require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.removeAllListeners("warning");

function parseHtml(response) {
  const separator = "\r\n\r\n";
  const separatorIndex = response.indexOf(separator);
  if (separatorIndex === -1) {
    throw new Error("The separator was not found in the response.");
  }
  const bodyPart = response.substring(separatorIndex + separator.length);
  const root = parse(bodyPart);
  root.querySelectorAll("script, style").forEach((node) => node.remove());
  return root.structuredText.replace(/(<([^>]+)>)/gi, "");
}

async function makeSearchCall() {
  const url = `www.googleapis.com`;
  const path = `/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=maxim+cojocari`;
  const res = await makeHttpsRequest(url, undefined, path);
  return res;
}

async function main() {
  const url = "localhost";
  const path = "/index.html";
  const res = await makeSearchCall();
  console.log(res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
