const connection = require('../connection')


const fetchCommentsByArticleId = (article_id) => {
    return connection
        .select('*')
        .from('comments')
        .where('article_id', '=', article_id)
        .then(comments => {
            return comments
        })
}


exports.fetchArticleById = (article_id) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', article_id)
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });
            else {
                return fetchCommentsByArticleId(article_id).then(comments => {
                    article[0].comment_count = comments.length;
                    return article[0]
                });
            };
        });
};