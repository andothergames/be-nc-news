const usersRouter = require('express').Router();

const { getUsers, getUser, createUser } = require("../controllers/users-controllers");

usersRouter
.route('/')
.get(getUsers)
.post(createUser);

usersRouter
.route('/:username')
.get(getUser);


module.exports = usersRouter;