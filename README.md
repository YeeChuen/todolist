
## To start the local web server
`
npm init -y
npm install live-server
npm install -g json-server
`

add this 3 lines to `package.json` under `"scripts"`
`
"json-server": "json-server --watch db.json"
"live-server": "live-server --ignore=./db.json ."
"start": "npm run json-server & npm run live-server"
`