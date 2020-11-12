const { updateCommentById, removeCommentById } = require("../models/comments")

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
    console.log(comment_id)
    removeCommentById(comment_id).then(() => {
        res.status(204).send({})
    })
}