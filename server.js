require("dotenv").config();
//var keys = require("./keys")
var express = require("express");
var app = express();
var path = require("path");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
// var md5 = require("md5")
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(session({
  secret: "app",
  cookie: {
    maxAge: 1 * 1000 * 60 * 60 * 24 * 365
  }
}));

app.use(cookieParser());

var mysql = require("mysql");
var connection;

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

// app.get('/', function(req, res){
//   res.send('hi');
// });

app.get("/users/:id", function(req, res) {
  connection.query("SELECT * FROM users WHERE id = ?", [req.params.id], function(error, results, fields) {
    if (error) throw error;

    res.json(results[0]);
  });
});

app.get("/signup/:username/:password", function(req, res) {

  bcrypt.genSalt(10, function(err, salt) {
    // res.send(salt);
    bcrypt.hash(req.params.password, salt, function(err, p_hash) {

      // res.send(p_hash);

      connection.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [req.params.username, p_hash], function(error, results, fields) {

        var what_user_sees = "";
        if (error) {
          what_user_sees = "Username already exists.";
        } else {
          what_user_sees = "Account successfully created. Login to continue.";
        }

        res.send(what_user_sees);

      });
    });
  });
});

app.get("/login/:username/:password", function(req, res) {

  connection.query("SELECT * FROM users WHERE username = ?", [req.params.username], function(error, results, fields) {

    if (error) throw error;

    // res.json(results);

    if (results.length == 0) {
      res.send("Username does not exist.");
    } else {
      bcrypt.compare(req.params.password, results[0].password_hash, function(err, result) {

        if (result == true) {

          req.session.user_id = results[0].id;
          req.session.username = results[0].username;

          res.send("You are logged in.");

        } else {

          res.send("Username and password does not match.");
        }
      });
    }
  });
});

app.get("/another-page", function(req, res) {
  var user_info = {
    user_id: req.session.user_id,
    username: req.session.username
  }

  res.json(user_info);
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    res.send("you are logged out");
  })
});

app.listen(3000, function() {
  console.log("listening on 3000");
});