const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment,
  changeVotes
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  selectArticles()
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
    return selectCommentsByArticleId(article_id)
  })
  .then((comments) => {
    res.status(200).send(comments)
  })
  .catch(next)
}

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  selectArticleById(article_id)
  .then(() => {
    return insertComment(article_id, newComment)
  })
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(next)
}

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  selectArticleById(article_id)
  .then(() => {
  return changeVotes(article_id, newVote)
  })
  .then((article) => {
    res.status(201).send(article)
  })
  .catch(next)
}