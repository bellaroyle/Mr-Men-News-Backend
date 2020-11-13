const connection = require('../connection')

exports.updateCommentById = (comment_id, inc_votes) => {
    if (typeof inc_votes !== 'number') return Promise.reject({ status: 400, msg: 'Bad Request' });

    return connection
        .from('comments')
        .where('comment_id', '=', comment_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(comments => {
            if (comments.length === 0) return Promise.reject({ status: 404, msg: 'Comment Not Found' });
            else return comments[0];
        })
}

exports.removeCommentById = (comment_id) => {

    return connection
        .delete()
        .from('comments')
        .where('comment_id', '=', comment_id)
        .returning('*')
        .then(comment => {
            if (comment.length === 0) return Promise.reject({ status: 404, msg: 'Comment Not Found' });
        })
}

exports.fetchCommentById = (comment_id) => {

    return connection
        .select('*')
        .from('comments')
        .where('comment_id', '=', comment_id)
        .then(comment => {
            if (comment.length === 0) return Promise.reject({ status: 404, msg: 'Comment Not Found' });
            else return comment[0]
        })
}