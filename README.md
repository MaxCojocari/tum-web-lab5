# tum-web-lab5

## Project Requirements

- node: >= 18.0.0
- npm: >= 8.0.0

## Before Start

1. Install all modules using `npm`;

2. Create `.env` file and complete it with your variables according to `.env.example`;

3. Ensure you have installed locally `openssl` (see this [tutorial](https://www.webhi.com/how-to/how-to-install-openssl-on-ubuntu-linux/) if not);

4. Create private key, CSR, and public certificate for TLS connections;

   ```shell
   openssl genrsa -out private-key.pem 1024
   openssl req -new -key private-key.pem -out csr.pem
   openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem

   ```

5. Install the `go2web` executable globally.

   ```shell
   sudo npm i -g .
   ```

## Demo

https://github.com/MaxCojocari/tum-web-lab5/assets/92053176/b3333615-b2f2-440f-8e6a-9a87e372eda9

