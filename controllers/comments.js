const { updateCommentById, removeCommentById, fetchCommentById } = require("../models/comments")

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body

    updateCommentById(comment_id, inc_votes).then(comment => {
        res.status(202).send({ comment })
    })
        .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id).then(() => {
        res.status(204).send({})
    })
        .catch(next)
}

exports.getCommentById = (req, res, next) => {
    const { comment_id } = req.params
    fetchCommentById(comment_id).then(comment => {
        res.status(200).send({ comment })
    })
        .catch(next)
}