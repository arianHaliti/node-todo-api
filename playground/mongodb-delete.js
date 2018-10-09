const { MongoClient, ObjectID } = require("mongodb");
// MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true })
MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log("Unable to Connect");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    //Deletes all documents with name atribute of "Arian"
    db.collection("Users")
      .deleteMany({ name: "Arian" })
      .then(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );

    // Finds the doc with te id of 5bb... deletes it and returns the obj.
    var id = new ObjectID("5bbb998686dd952bb0114f32");
    db.collection("Users")
      .findOneAndDelete({ _id: id })
      .then(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    client.close();
  }
);
