const { patchCommentById, deleteCommentById, getCommentById } = require('../controllers/comments');
const { send405 } = require('../controllers/errors');
const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id')
    .get(getCommentById)
    .patch(patchCommentById)
    .delete(deleteCommentById)
    .all(send405)

module.exports = commentsRouter;