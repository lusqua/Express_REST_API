const db = require("../../bin/mongodb");
var ObjectId = require("mongodb").ObjectID;

const verifyAuth = async (Authorization) => {
  if (!Authorization)
    return { status: 401, err: "no Authorization code", user: NaN };
  if (Authorization.length != 24)
    return { status: 401, err: "invalid Authorization code", user: NaN };

  const connections = await db.getDb().collection("Connections");
  const users = await db.getDb().collection("users");

  const auth = await connections.findOne({ _id: ObjectId(Authorization) });

  if (auth) {
    if (auth.expires_in < new Date())
      return { status: 403, err: "Expired Authorization code", user: NaN };

    const user = await users.findOne({ _id: auth.user_id });
    return { status: 200, err: NaN, user: user };
  }

  return { status: 401, err: "User not found", user: NaN };
};

module.exports = verifyAuth;
