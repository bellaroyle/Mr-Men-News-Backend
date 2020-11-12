const articlesRouter = require('express').Router()
const { getAllArticles, getArticleById, patchArticleById, postCommentToArticle, getCommentByArticle } = require('../controllers/articles');
const { send405 } = require('../controllers/errors')

articlesRouter.route('/')
    .get(getAllArticles)
    .all(send405)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)
    .all(send405)



articlesRouter.route('/:article_id/comments')
    .post(postCommentToArticle)
    .get(getCommentByArticle)
    .all(send405)


module.exports = articlesRouter;