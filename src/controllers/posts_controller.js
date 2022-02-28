const express = require("express");
const router = express.Router();

const db = require("../../bin/mongodb");
var ObjectId = require("mongodb").ObjectID;

router.get("/", (req, res, next) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("posts")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Erro em requisitar posts");
      } else {
        res.status(200).json(result);
      }
    });
});

router.post("/", (req, res, next) => {
  const dbConnect = db.getDb();

  post = {
    author: req.body.author,
    created_at: new Date().toJSON(),
    content: req.body.content,
  };

  dbConnect.collection("posts").insertOne(post, function (err, result) {
    if (err) {
      res.status(400).send("Erro em criar post");
    } else {
      res.status(204).send();
    }
  });
});

router.put("/:id", (req, res, next) => {
  const dbConnect = db.getDb();

  post = {
    updated_at: new Date().toJSON(),
  };
  if (typeof req.body.author != "undefined") {
    post["author"] = req.body.author;
  }
  if (typeof req.body.content != "undefined") {
    post["content"] = req.body.content;
  }

  dbConnect
    .collection("posts")
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: post },
      function (err, result) {
        if (err) {
          res.status(400).send("Erro ao encontrar o id");
        } else {
          dbConnect
            .collection("posts")
            .find({ _id: ObjectId(req.params.id) })
            .limit(1)
            .toArray((err, result) => {
              res.status(200).json(result);
            });
        }
      }
    );
});
module.exports = router;
