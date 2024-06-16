const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkUserExists = (author) => {
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

exports.checkUserAlreadyExists = (author) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (rows.length) {
        return Promise.reject({ status: 404, msg: "User already exists" });
      } else {
        return;
      }
    });
};

exports.insertUser = (author, name, avatar_url) => {
  return db
    .query(
      `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *`,
      [author, name, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
