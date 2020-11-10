const { getAllTopics } = require('../controllers/topics');
const { send405 } = require('../controllers/errors');
const topicsRouter = require('express').Router();

topicsRouter.route('/').get(getAllTopics).all(send405);

module.exports = topicsRouter;