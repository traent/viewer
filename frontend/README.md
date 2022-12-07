# Frontend

## Getting Started

- Move into `apps` workspace from root and run `sh build-libs.sh`
- Run `npm install`
- Run `dotnet workload install wasm-tools` to install wasm-tools workload
- Run `sh build-wasm-libraries.sh` to transpile ledger libraries to WASM and to move all the required files inside the right folder
- Run `npm run i18n:cache-busting dashboard-fact-checking` (if you need to run the dashboard-fact-checking) app

## Regen Connectors

Connectors can be regenerated through one of the following scripts, based on the application:

`npm run regen-connectors:<app-name>`

For example:

- `npm run regen-connectors:esg-app`
- `npm run regen-connectors:fact-app`
- `npm run regen-connectors:viewer-app`

## Available Applications

- dashboard-esg (run `npm run esg-app`)
- dashboard-fact-checking (run `npm run fact-app`)
- viewer-app (run `npm run viewer-app`)

## Translations

Translation's files are cached. In order to check if a file is changed or not we need to run `i18n-cache-busting.js` script.

Translations are set up only for:

- dashboard-fact-checking

Run `npm run i18n:cache-busting <target-project>` where the target project is one of the translated applications. For example: `npm run i18n:cache-busting dashboard-fact-checking`.

Actually you need to run:

- `npm run i18n:cache-busting dashboard-fact-checking`


---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
