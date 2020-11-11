const { updateCommentById } = require("../models/comments")

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body

    updateCommentById(comment_id, inc_votes).then(comment => {
        res.status(202).send({ comment })
    })
        .catch(next)
}