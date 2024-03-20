const net = require("net");
const { parse } = require("node-html-parser");

function makeHttpRequest(host, port = 80, path = "/") {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port, host }, () => {
      client.write(
        `GET ${path} HTTP/1.1\r\nHost: ${host}\r\nConnection: close\r\n\r\n`
      );
    });

    let response = "";

    client.on("data", (data) => {
      response += data.toString();
    });

    client.on("end", () => {
      resolve(response);
    });

    client.on("error", (err) => {
      reject(err);
    });
  });
}

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

async function main() {
  const url = "localhost";
  const path = "/index.html";
  const response = await makeHttpRequest(url, 5502, path);
  console.log(parseHtml(response));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
