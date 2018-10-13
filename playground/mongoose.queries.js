const { Todo } = require("./../models/todos");
const { mongoose } = require("./../db/db");
const { User } = require("./../models/users");
//const {ObjectId} = require('mongodb');

let id = "5bbf95eb03e5543510b687b9";
let idu = "5bbe5eb61dedd742b0c5c001";
Todo.findById({
  _id: id
})
  .then(todos => {
    if (todos == null) {
      return console.log("No todo found");
    }
    console.log("Find Todos", todos);
  })
  .catch(e => {
    console.log(e);
  });

// Todo.find().then(todos => {
//   if (todos.length == 0) return console.log("No todos found");
//   console.log("Todos : ", todos);
// });

User.findById({
  _id: idu
})
  .then(user => {
    if (user == null) {
      return console.log("No user found");
    }
    console.log("User Found :", user);
  })
  .catch(e => {
    console.log(e);
  });
