const router = require("express").Router();
var ObjectId = require("mongodb").ObjectID;

const passwordHash = require("password-hash");
const Database_connection = require("../../bin/mongodb");

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

router.get("/", (req, res, next) => {
  const users = Database_connection.getDb().collection("users");
  const connections = Database_connection.getDb().collection("Connections");

  users.findOne({ username: req.headers.username }, (err, usr) => {
    if (!usr) res.status(404).json("User not found.");
    if (!passwordHash.verify(req.headers.password, usr.password))
      return res.status(403).json("Wrong password.");

    connections.findOne({ user_id: usr._id }, (err, conn) => {
      if (conn) {
        if (conn.client_ip != req.ip) {
          db.inventory.deleteOne({ _id: conn._id });
          return NaN;
        }

        conn["expires_in"] = new Date().addHours(4);
        conn["updated_at"] = new Date().toJSON();
        connections.updateOne({ _id: ObjectId(conn._id) }, { $set: conn });

        return res.status(200).json(conn._id);
      }

      connection = {
        client_ip: req.ip,
        user_id: usr._id,
        expires_in: new Date().addHours(4),
        created_at: new Date().toJSON(),
      };

      connections.insertOne(connection, function (err, result) {
        if (err) {
          res.status(400).send("Failed creating connection");
        } else {
          res.status(200).json(result.insertedId);
        }
      });
    });
  });
});

module.exports = router;
