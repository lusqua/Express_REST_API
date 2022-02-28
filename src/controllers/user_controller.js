const express = require("express");
const router = express.Router();

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

router.get("/:username", (req, res, next) => {
  const users = Database_connection.getDb().collection("users");

  users.findOne({ username: req.params.username }, (err, usr) => {
    if (usr) res.status(200).json(usr);
    else res.status(404).json("Usuário não encontrado.");
  });
});

router.post("/", (req, res, next) => {
  const users = Database_connection.getDb().collection("users");

  user = {
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    created_at: new Date().toJSON(),
  };

  users.findOne({ username: req.body.username }, (err, usr) => {
    if (usr) {
      res.json("Usuário já existe");
    } else {
      users.insertOne(user, (err, result) => {
        if (err) {
          res.status(400).send("Something failed.");
        } else {
          res.status(200).json(result);
        }
      });
    }
  });
});

module.exports = router;
