const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
var { Todo } = require("../models/todos");
var { mongoose } = require("../db/db.js");
var { User } = require("../models/users");
const _ = require("lodash");

var app = express();
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then(
    doc => {
      //console.log(doc);
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
// GET Todos/:id route

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(404).send();
  Todo.findById({
    _id: id
  }).then(
    todo => {
      if (todo == null) return res.status(404).send();
      res.send({ todo });
    },
    e => {
      res.status(404).send();
    }
  );
});

// GET Todos route
app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// DELETE Todos/:id route
app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id).then(
    todo => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    },
    e => {
      res.status(400).send();
    }
  );
});
app.listen(3000, () => {
  console.log("Lisening to port 3000");
});
app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(404).send();
  var body = _.pick(req.body, ["text", "completed"]);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) return res.status(404).send();

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});
module.exports = { app };
