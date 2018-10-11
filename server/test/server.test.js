const expect = require("expect");
const request = require("supertest");

var { app } = require("./../server");
var { Todo } = require("./../../modules/todos");

beforeEach(done => {
  Todo.remove({}).then(() => done());
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
        Todo.find()
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
            expect(todos.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
