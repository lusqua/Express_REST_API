const express = require("express");
const router = express.Router();
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

router.put("/:username", (req, res, next) => {
  const users = Database_connection.getDb().collection("users");

  edited_user = {
    updated_at: new Date().toJSON(),
  };

  if (req.body.new_username) edited_user["username"] = req.body.new_username;
  if (req.body.new_password)
    edited_user["password"] = passwordHash.generate(req.body.new_password);

  users.findOne({ username: req.params.username }, (err, usr) => {
    if (!usr) return res.status(404).json("User not found.");
    if (!passwordHash.verify(req.body.password, usr.password))
      return res.status(403).json("Wrong password.");
    if (passwordHash.verify(req.body.password, usr.password))
      return res.status(406).json("Can't use same password.");

    users.updateOne(
      { _id: ObjectId(usr._id) },
      { $set: edited_user },
      (err, result) => {
        if (err) res.status(400).send("Erro ao encontrar o id");
        else
          res.status(200).json({
            status: "ok",
            edited: edited_user,
          });
      }
    );
  });
});

module.exports = router;
