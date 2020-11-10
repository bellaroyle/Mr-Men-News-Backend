const { fetchArticleById, updateArticleById } = require("../models/articles")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then(article => {
        res.status(200).send({ article })
    })
        .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    //console.log(Object.keys(req.body))
    if (Object.keys(req.body)[0] !== 'inc_votes'
        || Object.keys(req.body).length !== 1) {
        res.status(400).send({ msg: "Bad Request: Action Not Allowed" })
    }
    else {
        const { article_id } = req.params;
        const { inc_votes } = req.body;
        //console.log(req.body)
        updateArticleById(article_id, inc_votes).then(article => {
            res.status(202).send({ article })
        })
            .catch(next)
    }
}