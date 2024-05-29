const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  selectCommentsByArticleId(id)
  .then((comments) => {
    res.status(200).send(comments)
  })
  .catch(next)
}

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body;
  insertComment(id, newComment)
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(next)
}