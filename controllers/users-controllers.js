const {
    selectUsers,
    selectUser,
    checkUserExists
  } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
      res.status(200).send(users)
    })
  }

exports.getUser = (req, res, next) => {
  const username = req.params.username
  checkUserExists(username)
  .then(() => {
    return selectUser(username)
  })
  .then((user) => {
    res.status(200).send(user)
  })
  .catch(next);
}