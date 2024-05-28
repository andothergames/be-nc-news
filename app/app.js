const { getTopics } = require("../controllers/topics-controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status && err.mssg) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next();
  }
});

module.exports = app;
