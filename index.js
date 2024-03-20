const net = require("net");

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

async function main() {
  const url = "localhost";
  const path = "/index.html";
  const response = await makeHttpRequest(url, 5500, path);
  console.log(response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
