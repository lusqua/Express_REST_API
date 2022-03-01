const db = require("../../bin/mongodb");
var ObjectId = require("mongodb").ObjectID;

const verifyAuth = async (Authorization) => {
  const connections = await db.getDb().collection("Connections");
  if (Authorization.length != 24) return false;
  const auth = await connections.findOne({ _id: ObjectId(Authorization) });

  if (auth) return auth;

  return false;
};

module.exports = verifyAuth;
