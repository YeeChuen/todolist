## Project Goals

## Dependencies

`node.js`

install node.js on your device by using either:

[nvm](https://github.com/nvm-sh/nvm)

or

[node](https://nodejs.org/en/download)

## Installation

1. install npm packages

```
npm init -y
npm install live-server
npm install -g json-server
npm install npm-run-all --save-dev
```

2. set up json server for mock db, add this 3 lines to `package.json` under `"scripts"`

```
"json-server": "json-server --watch db.json"
"live-server": "live-server --ignore=./db.json ."
"start": "npm run json-server & npm run live-server"
```

now your script should look like

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json-server": "json-server --watch db.json",
    "live-server": "live-server --ignore=./db.json .",
    "start": "npm run json-server & npm run live-server"
  }
```

## Start local server

To start the local server for `todolist` app, use

windows:


macOS:

`npm run start`