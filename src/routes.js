const express = require("express");

const app = express();

app.use(express.json());

app.use("/", require("./index"), require("./controllers/posts_controller"), require("./controllers/user_controller"))

module.exports = app;
