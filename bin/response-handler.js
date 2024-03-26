const { parse } = require("node-html-parser");

function splitResBody(response) {
  const separator = "\r\n\r\n";
  const separatorIndex = response.indexOf(separator);
  if (separatorIndex === -1) {
    throw new Error("The separator was not found in the response.");
  }
  const header = response.substring(0, separatorIndex);
  const body = response.substring(separatorIndex + separator.length);
  return { header, body };
}

function parseHtml(response) {
  const root = parse(splitResBody(response).body);
  root.querySelectorAll("script, style").forEach((node) => node.remove());
  return root.structuredText.replace(/(<([^>]+)>)/gi, "");
}

module.exports = { splitResBody, parseHtml };
