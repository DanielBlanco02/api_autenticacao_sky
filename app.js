var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();


app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({extended: true}));

var connection = mongoose.connect("mongodb://localhost/sky", {useMongoClient:true});

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var routes = require('./routes/index.routes')(app);

const port = process.env.PORT || 8080;

var server_http = http.createServer(app);

server_http.listen(port, function() {
    console.log("Server running on port:", port)
});
