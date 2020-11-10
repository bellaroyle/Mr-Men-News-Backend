const connection = require('../connection')

exports.fetchArticleById = (article_id) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', article_id)
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });
            else return article[0];
        })
}