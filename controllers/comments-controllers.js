const {
  removeComment,
  checkCommentExists,
  changeCommentVotes
} = require("../models/comments-models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const newVote = req.body;
  checkCommentExists(comment_id)
    .then(() => {
      return changeCommentVotes(comment_id, newVote);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);

}