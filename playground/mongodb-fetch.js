const mongoClient = require("mongodb").MongoClient;
// MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true })
mongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log("Unable to Connect");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    db.collection("Users")
      .find({
        age: 25
      })
      .toArray()
      .then(
        users => {
          console.log(JSON.stringify(users, undefined, 2));
        },
        err => {
          console.log("Unable to fetch users", err);
        }
      );

    client.close();
  }
);
