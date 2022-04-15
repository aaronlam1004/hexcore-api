const bodyParser = require('body-parser');
const express = require('express');

const sets = require('./sets.js');
const setsRouter = sets.router;
const CreateErrorJson = sets.CreateErrorJson;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/site"));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/site/index.html');
});

app.use(express.static(__dirname + "/client"));
app.get('/demo', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/', setsRouter);

app.all('/*', function(req, res) {
  res.json(CreateErrorJson(404, "path", `${req.path} does not exist`));
});

console.log("Starting up API server!");
console.log(`Running on PORT: ${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);
