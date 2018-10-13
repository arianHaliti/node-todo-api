const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

var { app } = require("./../server");
var { Todo } = require("./../../models/todos");

const dummies = [
  {
    _id: new ObjectId(),
    text: "First todo"
  },
  {
    _id: new ObjectId(),
    text: "Second todo"
  }
];

beforeEach(done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(dummies);
    })
    .then(() => done());
});

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
      .get(`/todos/${dummies[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummies[0].text);
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
