const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment,
  changeVotes,
  checkTopicExists,
  checkCategoryExists,
  checkOrderValid,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  const { sort_by } = req.query;
  const { order } = req.query;

  const checkPromises = [];
  if (sort_by) {
    checkPromises.push(checkCategoryExists(sort_by));
  }
  if (topic) {
    checkPromises.push(checkTopicExists(topic));
  }
  if (order) {
    checkPromises.push(checkOrderValid(order));
  }

  Promise.all(checkPromises)
    .then(() => {
      return selectArticles(topic, sort_by, order);
    })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  selectArticleById(article_id)
    .then(() => {
      return insertComment(article_id, newComment);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  selectArticleById(article_id)
    .then(() => {
      return changeVotes(article_id, newVote);
    })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};
