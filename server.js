//345678901234567890123456789012345678901234567890123456789012345678901234567890
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const port = process.argv[2] || 3030;
const home = `http://localhost:${port}`;
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
const app = express();
const configure = () => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(allowCrossDomain);
};
configure();

let count = 0;
function showHit(msg) {
  console.log(++count, msg);
}

////////////////////////////// LOGIC ///////////////////////////////////////////


app.get('/', function (req, res) {
  showHit("index.html");
  res.sendFile('index.html', { root: __dirname });
});

const server = app.listen(port, function () {
  log(`running at localhost:${port}/`);
});
