const { getTopics } = require("../controllers/topics-controllers");
const { getEndpoints } = require("../controllers/api-controllers");
const { getArticles, getArticleById, getcommentsByArticleId } = require("../controllers/articles-controllers");

const express = require("express");
const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getcommentsByArticleId);

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
