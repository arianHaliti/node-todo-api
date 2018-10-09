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
      .findOneAndUpdate(
        { _id: new ObjectID("5bbcd9b7e94ce50ea831d0d6") },
        {
          $set: { name: "Jeff", location: "Unknown" },
          $inc: { age: -1 }
        },
        { returnOriginal: false }
      )
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
