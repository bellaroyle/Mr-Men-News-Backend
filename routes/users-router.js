const { send405 } = require('../controllers/errors');
const { getUserByUsername } = require('../controllers/users');
const usersRouter = require('express').Router();

usersRouter.route('/:username').get(getUserByUsername).all(send405);

module.exports = usersRouter;