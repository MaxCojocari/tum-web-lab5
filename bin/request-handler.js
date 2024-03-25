const tls = require("tls");
const fs = require("fs");

function makeHttpsRequest(host, port = 443, path = "/") {
  return new Promise((resolve, reject) => {
    const options = {
      host,
      port,
      key: fs.readFileSync("private-key.pem"),
      cert: fs.readFileSync("public-cert.pem"),
      rejectUnauthorized: false,
    };

    const client = tls.connect(options, () => {
      client.write(
        `GET ${path} HTTP/1.0\r\nHost: ${host}\r\nConnection: close\r\n\r\n`
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

module.exports = { makeHttpsRequest };
