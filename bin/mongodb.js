const yenv = require("yenv");

const env = yenv("./bin/database.yml");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@cluster0.3agtn.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let dbConnection;

module.exports = {
  connectToServer: (callback) => {
    client.connect((err, db) => {
      if (err) {
        console.error(err);
        return err;
      } else {
        const db_name = env.DB_NAME;

        dbConnection = db.db(db_name);
        console.log(`Conectado com sucesso a ${db_name}`);
      }
    });
  },

  getDb: () => {
    return dbConnection;
  },
};
