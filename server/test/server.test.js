const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

var { app } = require("./../server");
var { Todo } = require("./../../models/todos");
var { User } = require("./../../models/users");

beforeEach(populateTodos);
beforeEach(populateUsers);

describe("GET / Todos", () => {
  it("Should return all Todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("POST / Todos", () => {
  it("Should add a new Todo", done => {
    var text = "Some new todo";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("Should not add a new Todo", done => {
    request(app)
      .post("/todos")
      .send({ text: "" })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe(" GET /todos/:id", () => {
  it("should return todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectId()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", done => {
    request(app)
      .get(`/todos/abc123`)
      .expect(404)
      .end(done);
  });
});

describe("DELET /todos/:id", () => {
  it("should  remove a todo", done => {
    let id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(id)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
  it("should return 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${new ObjectId()}`)
      .expect(404)
      .end(done);
  });
  it("should return 404 if Object id is not valid", done => {
    request(app)
      .delete("/todos/123abbb")
      .expect(404)
      .end(done);
  });
});
describe("PATCH /todos:id", () => {
  it("should updae the todo", done => {
    let id = todos[0]._id.toHexString();
    var text = "This should be new text";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    let id = todos[1]._id.toHexString();
    var text = "Updating test Text";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
describe("POST /users ", () => {
  it("should create a new user", done => {
    request(app)
      .post("/users")
      .send({ email: "example@g.com", password: "123123" })
      .expect(200)
      .expect(res => {
        expect(res.body.email).toExist();
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
      })
      .end(err => {
        if (err) return done(err);
        User.findOne({ email: "example@g.com" })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe("123123");
            done();
          })
          .catch(e => done(e));
      });
  });
  it("should return validation errors if request invalid", done => {
    request(app)
      .post("/users")
      .send({ email: "mani@g.com", password: "222" })
      .expect(400)
      .end(done);
  });
  it("should not create user if email in use", done => {
    request(app)
      .post("/users")
      .send({ email: "arain@g.com", password: "1231231" })
      .expect(400)
      .end(done);
  });
});

describe("POST /user/login", () => {
  it("Should login user and return auth token", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[0]).toInclude({
              access: "auth",
              token: res.headers["x-auth"]
            });
            done();
          })
          .catch(e => done(e));
      });
  });
  it("Should reject invalid login", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: "aaaa123"
      })
      .expect(400)
      .expect(res => {
        expect(res.header["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
