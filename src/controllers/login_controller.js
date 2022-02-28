const router = require("express").Router();
var ObjectId = require("mongodb").ObjectID;

const passwordHash = require("password-hash");
const Database_connection = require("../../bin/mongodb");

router.get("/", (req, res, next) => {
  const users = Database_connection.getDb().collection("users");

  users
    .find({}, { username: 1, created_at: 1, _id: 0, password: 0 })
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).json("Erro em requisitar posts");
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
