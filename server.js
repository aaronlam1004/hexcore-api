const bodyParser = require('body-parser');
const express = require('express');

const sets = require('./sets.js');

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

app.use('/', sets);

console.log("Starting up API server!");
app.listen(process.env.PORT || 3000);
