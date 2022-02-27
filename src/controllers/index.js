const express = require("express");
const router = express.Router();

const db = require("../../bin/mongodb");

router.get("/", function (req, res, next) {
  const dbConnect = db.getDb();

  dbConnect
    .collection("posts")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

router.post("/create", function (req, res, next) {
  const dbConnect = db.getDb();

  dbConnect.collection("posts").insertOne(req.body, function (err, result) {
    if (err) {
      res.status(400).send("Error inserting matches!");
    } else {
      console.log(`Criado post com id ${result.insertedId}`);
      res.status(204).send();
    }
  });
});
module.exports = router;
