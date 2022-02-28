const express = require("express");

const app = express();

app.use(express.json());

app.use("/", require("./index"));
app.use("/posts", require("./controllers/posts_controller"));
app.use("/user", require("./controllers/user_controller"));

module.exports = app;
