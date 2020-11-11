const { getCommentById } = require('../controllers/comments');
const { send405 } = require('../controllers/errors');
const commentsRouter = require('express').Router();

commentsRouter.route('/').patch(getCommentById)

module.exports = commentsRouter;