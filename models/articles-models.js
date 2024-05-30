const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.article_id) AS INTEGER) AS comment_count FROM articles a LEFT JOIN comments c ON c.article_id = a.article_id GROUP BY a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url ORDER BY a.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

checkUserExists = (author) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 400, msg: "User does not exist" });
      } else {
        return;
      }
    });
};
exports.insertComment = (id, { author, body }) => {
  if (!author || !body) {
    return Promise.reject({ status: 400, msg: "Missing information" });
  }
  return checkUserExists(author)
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [id, author, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.changeVotes = (id, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Missing information" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};