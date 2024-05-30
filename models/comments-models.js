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
