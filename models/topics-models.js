const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicAlreadyExists = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])

    .then(({ rows }) => {
      if (rows.length) {
        return Promise.reject({ status: 404, msg: "Topic already exists" });
      }
    });
};

exports.insertTopic = (slug, description) => {
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
