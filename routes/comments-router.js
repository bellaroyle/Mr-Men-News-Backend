const { patchCommentById, deleteCommentById } = require('../controllers/comments');
const { send405 } = require('../controllers/errors');
const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id')
    .patch(patchCommentById)
    .delete(deleteCommentById)

module.exports = commentsRouter;