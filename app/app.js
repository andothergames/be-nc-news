
const express = require("express");
const app = express();
const apiRouter = require('../routes/api-router')

app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next();
  }
});

module.exports = app;
