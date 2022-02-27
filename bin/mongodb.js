const yenv = require("yenv");

const env = yenv("./bin/database.yml");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${env.USERNAME}:${env.PASSWORD}@cluster0.3agtn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let dbConnection;

module.exports = {
  connectToServer: (callback) => {
    client.connect((err, db) => {
      // perform actions on the collection object
      dbConnection = db.db("Blog_test");
      console.log("Successfully connected to MongoDB.");
    });
  },

  getDb: () => {
    return dbConnection;
  },
};
