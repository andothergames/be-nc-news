const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT article_id, title, author, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      const commentCountPromises = rows.map((object) => {
        return countComments(object.article_id).then((count) => {
          object.comment_count = count;
          return object;
        });
      });
      return Promise.all(commentCountPromises);
    });
};

countComments = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      return rows.length;
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
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      } else {
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
            [id]
          )
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};

exports.insertComment = (id, { author, body }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      } else {
        return db
          .query(
            `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
            [id, author, body]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};
