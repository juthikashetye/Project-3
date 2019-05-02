require("dotenv").config();
//var keys = require("./keys")
var express = require('express');
var app = express();
var path = require("path");
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
// var md5 = require("md5")
var cparser = require("cookie-parser");
var session = require("express-session");

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(session({
  secret: 'app',
  cookie: {
    maxAge: 1 * 1000 * 60 * 60 * 24 * 365
  }
}));

app.use(cparser());

var mysql = require('mysql');
var connection

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL)

} else {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}

connection.connect();
