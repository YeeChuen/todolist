
## To start the local web server

1. install npm packages

```
npm init -y
npm install live-server
npm install -g json-server
```

2. set up json server for mock db, add this 3 lines to `package.json` under `"scripts"`

```
"json-server": "json-server --watch db.json"
"live-server": "live-server --ignore=./db.json ."
"start": "npm run json-server & npm run live-server"
```