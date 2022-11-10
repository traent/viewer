# Frontend

## Getting Started

- Run `npm install`
- Run `dotnet workload install wasm-tools` to install wasm-tools workload
- Run `sh build-wasm-libraries.sh` to transpile ledger libraries to WASM and to move all the required files inside the right folder

## Regen Connectors

Connectors can be regenerated through one of the following scripts, based on the application:

`npm run regen-connectors:<app-name>`

For example:

- `npm run regen-connectors:viewer-app`

## Run

- run `npm run viewer-app`
