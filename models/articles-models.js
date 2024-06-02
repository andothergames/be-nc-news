const db = require("../db/connection");

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  const queryValues = [];
  let sqlQuery = `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.article_id) AS INTEGER) AS comment_count FROM articles a LEFT JOIN comments c ON c.article_id = a.article_id`;

  if (topic) {
    sqlQuery += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  sqlQuery += ` GROUP BY a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url ORDER BY a.${sort_by} ${order}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.checkQueryValid = (queries) => {
  const validQueries = ["topic", "sort_by", "order"];
  for (key in queries) {
    if (!validQueries.includes(key)) {
      return Promise.reject({ status: 404, msg: "Bad request" });
    }
  }
};

exports.checkTopicExists = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
  WHERE slug = $1`,
      [topic]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Topic does not exist" });
      }
    });
};

exports.checkCategoryExists = (column) => {
  return db
    .query(
      `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'articles'`
    )
    .then(({ rows }) => {
      const columns = rows.map((row) => row.column_name);
      if (!columns.includes(column)) {
        return Promise.reject({
          status: 400,
          msg: "sort_by value does not exist",
        });
      }
    });
};

exports.checkOrderValid = (order) => {
  const validOrders = ["asc", "desc"];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.body, a.article_img_url, CAST(COUNT(c.article_id) AS INTEGER) AS comment_count FROM articles a LEFT JOIN comments c ON c.article_id = a.article_id WHERE a.article_id = $1 GROUP BY a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.body, a.article_img_url`,
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
        return Promise.reject({ status: 404, msg: "User does not exist" });
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
