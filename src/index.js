const express = require("express");
const router = express.Router();

const verifyAuth = require("./helpers/authentication_helper");

router.get("/", async (req, res, next) => {
  const auth = await verifyAuth(req.headers.authorization);
  if (auth) return res.json("é sobre isso");

  return res.status(401).json();
});

module.exports = router;
