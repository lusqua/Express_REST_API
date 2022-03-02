const db = require("../../bin/mongodb");
var ObjectId = require("mongodb").ObjectID;

const verifyAuth = async (Authorization) => {
  if (!Authorization) return false;
  if (Authorization.length != 24) return false;

  const connections = await db.getDb().collection("Connections");
  const users = await db.getDb().collection("users");

  const auth = await connections.findOne({ _id: ObjectId(Authorization) });

  if (auth) {
    const user = await users.findOne({ _id: auth.user_id });
    return user;
  }

  return false;
};

module.exports = verifyAuth;
