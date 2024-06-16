const db = require("../db/connection");

exports.removeComment = (id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1 RETURNING *`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkCommentExists = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
    });
};


exports.changeCommentVotes = (id, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Missing information" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });

}
