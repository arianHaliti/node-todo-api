const express = require("express");
const bodyParser = require("body-parser");

var { Todo } = require("../modules/todos");
var { mongoose } = require("../db/db.js");
var { User } = require("../modules/users");

var app = express();
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then(
    doc => {
      console.log(doc);
      res.status(200).send(doc);
    },
    e => {
      // console.log(e);
      res.status(400).send(e);
    }
  );
});

app.post("/users", (req, res) => {
  var newUser = new User({
    email: req.body.email
  });
  newUser.save().then(
    doc => {
      console.log(doc);
      res.send(doc);
    },
    e => {
      console.log(e);
      res.status(400).send(e);
    }
  );
});
app.listen(3000, () => {
  console.log("Lisening to port 3000");
});

module.exports = { app };
