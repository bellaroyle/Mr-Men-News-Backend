const {
    fetchAllArticles,
    fetchArticleById,
    updateArticleById,
    addCommentToArticle,
    fetchCommentsByArticle
} = require("../models/articles")

exports.getAllArticles = (req, res, next) => {
    const { sort_by, order } = req.query;
    fetchAllArticles(sort_by, order).then(articles => {
        //console.log(articles)
        res.status(200).send({ articles })
    })
        .catch(next)
}


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then(article => {
        res.status(200).send({ article })
    })
        .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (typeof inc_votes !== 'number') { res.status(400).send({ msg: "Bad Request" }) }
    else {
        updateArticleById(article_id, inc_votes).then(article => {
            res.status(202).send({ article })
        })
            .catch(next)
    }
}

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, ...restOfBody } = req.body;
    addCommentToArticle(article_id, username, restOfBody).then(comment => {
        res.status(201).send({ comment })
    })
        .catch(next)
}

exports.getCommentByArticle = (req, res, next) => {
    const { sort_by, order } = req.query;
    const { article_id } = req.params;
    fetchCommentsByArticle(article_id, sort_by, order).then(comments => {
        res.status(200).send({ comments })
    })
        .catch(next)
}