const { Todo } = require("./../models/todos");
const { mongoose } = require("./../db/db");

Todo.findByIdAndRemove({ _id: "5bc27634dc74f1323834b260" }).then(
  todo => {
    console.log(todo);
  },
  e => {
    console.log(e);
  }
);

Todo.findOneAndRemove("5bc27634dc74f1323834b261").then(
  todo => {
    console.log(todo);
  },
  e => {
    console.log();
  }
);
