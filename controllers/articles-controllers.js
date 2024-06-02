const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment,
  changeArticleVotes,
  checkTopicExists,
  checkCategoryExists,
  checkOrderValid,
  checkQueryValid
} = require("../models/articles-models");

const {
  checkUserExists
} = require('../models/users-models')

exports.getArticles = (req, res, next) => {
  lowerCaseQueries = {};

  for (key in req.query) {
    lowerCaseQueries[key.toLowerCase()] = req.query[key].toLowerCase();
  }

  const { topic, sort_by, order } = lowerCaseQueries;

  const checkPromises = [];
  checkPromises.push(checkQueryValid(lowerCaseQueries));
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
  const { body, author } = req.body;

  if (!author || !body) {
    return res.status(400).send({ status: 400, msg: "Missing information" });
  }

  const checkPromises = [];
  checkPromises.push(selectArticleById(article_id));
  checkPromises.push(checkUserExists(newComment.author));

  Promise.all(checkPromises)
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
      return changeArticleVotes(article_id, newVote);
    })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};
