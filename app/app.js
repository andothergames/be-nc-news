const { getTopics } = require("../controllers/topics-controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

module.exports = app;
