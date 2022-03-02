const router = require("express").Router();

const db = require("../../bin/mongodb");
var ObjectId = require("mongodb").ObjectID;

const verifyAuth = require("../helpers/authentication_helper");

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

router.post("/", async (req, res, next) => {
  const user = await verifyAuth(req.headers.authorization);
  if (!user) return res.status(401).json();

  const dbConnect = db.getDb();

  post = {
    author: user.username,
    author_id: user._id,
    created_at: new Date().toJSON(),
    content: req.body.content,
  };

  dbConnect.collection("posts").insertOne(post, function (err, result) {
    if (err) {
      res.status(400).send("Erro em criar post");
    } else {
      res.status(200).json(post);
    }
  });
});

router.put("/:id", async (req, res, next) => {
  if (!req.params.id || req.params.id.length != 24)
    return res.status(404).json();
  if (!req.body.content) return res.status(204).json();

  const user = await verifyAuth(req.headers.authorization);
  if (!user) return res.status(401).json();

  const posts = db.getDb().collection("posts");

  edited_post = {
    content: req.body.content,
    updated_at: new Date().toJSON(),
  };

  const post = await posts.findOne({ _id: ObjectId(req.params.id) });

  if (post.author_id.str != user._id.str) return res.status(401).json();

  posts.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: edited_post },
    function (err, result) {
      if (err) {
        res.status(400).json("Error trying find ID");
      } else {
        posts
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
