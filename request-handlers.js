const net = require("net");
const tls = require("tls");

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

function makeHttpsRequest(host, port = 443, path = "/") {
  return new Promise((resolve, reject) => {
    const options = { host, port };

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

module.exports = { makeHttpRequest, makeHttpsRequest };
