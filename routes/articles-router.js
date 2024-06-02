const articlesRouter = require('express').Router();

const {
    getArticles,
    getArticleById,
    getCommentsByArticleId,
    postComment,
    patchArticleVotes,
  } = require("../controllers/articles-controllers");

  articlesRouter
  .route('/')
  .get(getArticles);

  articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVotes);

  articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

  module.exports = articlesRouter;

  