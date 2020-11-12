const connection = require('../connection')

exports.updateCommentById = (comment_id, inc_votes) => {
    if (typeof inc_votes !== 'number') return Promise.reject({ status: 400, msg: 'Bad Request' });

    return connection
        .select('*')
        .from('comments')
        .where('comment_id', '=', comment_id)
        .returning('*')
        .then(comments => {
            if (comments.length === 0) return Promise.reject({ status: 404, msg: 'Comment Not Found' });
            else {
                comments[0].votes += inc_votes
                return comments[0];
            }
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
            //else return comment
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