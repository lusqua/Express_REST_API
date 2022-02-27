const express = require("express");
const router = express.Router();

const passwordHash = require('password-hash');
const db = require("../../bin/mongodb");

router.get("/user", (req, res, next) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("users")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Erro em requisitar posts");
      } else {
        res.json(result);
      }
    });
});

router.post("/user", (req, res, next) => {
  const dbConnect = db.getDb();

  post = {
    author: req.body.author,
    created_at: new Date().toJSON(),
    content: req.body.content
  }

  dbConnect.collection("posts").insertOne( post, function (err, result) {
    if (err) {
      res.status(400).send("Erro em criar post");
    } else {
      res.status(204).send();
    }
  });

});

module.exports = router;