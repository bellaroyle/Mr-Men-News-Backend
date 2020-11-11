
const connection = require('../connection')

exports.fetchAllArticles = (sort_by, order) => {
    if (order !== 'asc' && order !== 'desc' && order !== undefined) {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    return connection
        .select('articles.*')
        .count('comment_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id ')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .then(articles => {
            //console.log(sort_by, articles)
            return articles;
        })
}

exports.fetchArticleById = (article_id) => {
    return connection
        .select('articles.*')
        .count('comment_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id ')
        .where('articles.article_id', '=', article_id)
        .then(articles => {
            if (articles.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });
            else {
                return articles[0]
            }
        })
};

exports.updateArticleById = (article_id, inc_votes) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', article_id)
        .returning('*')
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });
            else {
                article[0].votes += inc_votes
                return article[0];
            }
        })
}

exports.addCommentToArticle = (article_id, username, restOfBody) => {
    if (typeof restOfBody.body !== 'string') {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }

    return connection
        .select('username')
        .from('users')
        .then((users) => {
            const usernames = users.map(user => {
                return user.username
            })
            if (usernames.includes(username)) {
                return connection
                    .insert({ author: username, ...restOfBody, article_id, created_at: new Date() })
                    .into('comments')
                    .returning('*')
                    .then(comment => {
                        return comment[0]
                    })
            }
            else {
                return Promise.reject({ status: 400, msg: 'Bad Request' })
            };
        })
}

exports.fetchCommentsByArticle = (article_id, sort_by, order) => {
    if (order !== 'asc' && order !== 'desc' && order !== undefined) {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    return connection
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .from('comments')
        .where('article_id', '=', article_id)
        .orderBy(sort_by || 'created_at', order || 'desc')
        .then(comments => {
            if (comments.length === 0) return Promise.reject({ status: 400, msg: "Bad Request" });
            else return comments
        })
}