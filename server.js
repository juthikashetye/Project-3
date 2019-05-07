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

app.get("/users/:user_id", function(req, res) {
  connection.query("SELECT * FROM users WHERE id = ?", [req.params.user_id], function(error, results, fields) {
    if (error) throw error;

    res.json(results[0]);
  });
});

app.post("/signup/:username/:password", function(req, res) {

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

app.post("/login/:username/:password", function(req, res) {

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

// inserts info into notebooks table
app.post("/add-notebook/:user_id", function(req, res) {

  connection.query("INSERT INTO notebooks (notebook_name, user_id) VALUES (?, ?)", [req.body.notebook_name, req.params.user_id], function(error, results, fields) {

      if (error) res.send(error)
      else res.send(results.insertId.toString());

  });

});

// inserts info into notes table
app.post("/add-notes/:notebook_id", function(req, res) {

  connection.query("INSERT INTO notes (title,ingredients,instructions,image,source,notebook_id) VALUES (?,?,?,?,?,?)",
    [req.body.title,req.body.ingredients,req.body.instructions,req.body.image,req.body.source,req.params.notebook_id],
    function(error, results, fields) {

      if (error) res.send(error)
      else res.send(results.insertId.toString());

  });
});

// gets all notes for specified notebook
app.get("/get-notebook-notes/:notebook_id", function(req, res) {

  connection.query("SELECT * FROM notes WHERE notebook_id = ?", [req.params.notebook_id], function(error, results, fields) {

    if (error) res.send(error)
    else res.json(results);

  });
});

// gets all notes for specified user
app.get("/get-all-notes/:user_id", function(req, res) {

  var allNotes = `SELECT notes.id,notes.title,notes.ingredients,notes.instructions,notes.image,notes.source 
                  FROM notes
                  LEFT JOIN notebooks 
                  ON notes.notebook_id = notebooks.id 
                  LEFT JOIN users 
                  ON notebooks.user_id = users.id 
                  WHERE users.id = ?`

  connection.query(allNotes, [req.params.user_id], function(error, results, fields) {

    if (error) res.send(error)
    else res.json(results);

  });
});

// gets all notebooks for specified user
app.get("/get-all-notebooks/:user_id", function(req, res) {

  var allNotebooks = `SELECT notebooks.id,notebooks.notebook_name 
                      FROM notebooks
                      LEFT JOIN users 
                      ON notebooks.user_id = users.id 
                      WHERE users.id = ?`

  connection.query(allNotebooks, [req.params.user_id], function(error, results, fields) {

    if (error) res.send(error)
    else res.json(results);

  });
});

app.get("/get-session", function(req, res) {
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