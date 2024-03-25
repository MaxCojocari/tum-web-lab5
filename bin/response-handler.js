const { parse } = require("node-html-parser");

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

module.exports = { splitResBody, parseHtml };
