const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const { getEndpoints } = require('../controllers/api');
const { send405 } = require('../controllers/errors');

const apiRouter = require('express').Router();

apiRouter.route('/').get(getEndpoints).all(send405)

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);


module.exports = apiRouter;