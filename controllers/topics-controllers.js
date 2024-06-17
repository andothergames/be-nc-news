const {
  selectTopics,
  insertTopic,
  checkTopicAlreadyExists,
} = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  const { slug, description } = req.body;

  if (!slug || !description) {
    return res.status(400).send({ status: 400, msg: "Missing information" });
  }

  checkTopicAlreadyExists(slug)
    .then(() => {
      return insertTopic(slug, description);
    })
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
