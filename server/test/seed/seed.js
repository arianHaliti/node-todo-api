const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { User } = require("./../../../models/users");
const { Todo } = require("./../../../models/todos");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: "arain@g.com",
    password: "123123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneID, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "user2@g.com",
    password: "123123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoID, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
];
const todos = [
  {
    _id: new ObjectID(),
    text: "First todo 1",
    _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: "Second todo 2",
    completed: true,
    completedAt: 333,
    _creator: userTwoID
  }
];

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => {
      done();
    });
};
module.exports = { todos, populateTodos, users, populateUsers };
