const {
  selectUsers,
  selectUser,
  checkUserExists,
  checkUserAlreadyExists,
  insertUser,
} = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send(users);
  });
};

exports.getUser = (req, res, next) => {
  const username = req.params.username;
  checkUserExists(username)
    .then(() => {
      return selectUser(username);
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const newUser = req.body;
  const { author, name } = req.body;
  let { avatar_url } = req.body;

  if (!author || !name) {
    return res.status(400).send({ status: 400, msg: "Missing information" });
  }

  if (!avatar_url) {
    avatar_url = "https://i.ibb.co/xYwwGSb/avatargrey.png";
  }

  checkUserAlreadyExists(author)
    .then(() => {
      return insertUser(author, name, avatar_url);
    })
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
