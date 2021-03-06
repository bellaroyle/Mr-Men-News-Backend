
const connection = require('../connection')
const { checkUsernameExists } = require('./users')
const { checkTopicExists } = require('./topics')

exports.fetchNoOfArticles = (author, topic) => {
    return connection
        .select('*')
        .from('articles')
        .modify(query => {
            if (author) {
                query.where('articles.author', '=', author)
            }
            if (topic) {
                query.where('articles.topic', '=', topic)
            }
        }).then(articles => {
            return articles.length
        })
}

exports.fetchAllArticles = (sort_by, order, author, topic, limit, p) => {

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
        .limit(parseInt(limit) || 10)
        .modify(query => {
            if (author) {
                query.where('articles.author', '=', author)
            }
            if (topic) {
                query.where('articles.topic', '=', topic)
            }
            if (p > 1) {
                query.offset(parseInt(limit) * parseInt(p - 1) || 10 * parseInt(p - 1))
            }

        })
        .then(articles => {
            if (articles.length === 0) {
                if (author && topic) {
                    return Promise.all([articles, checkUsernameExists(author), checkTopicExists(topic)]);
                }
                else if (author) return Promise.all([articles, checkUsernameExists(author), true]);
                else if (topic) {
                    return Promise.all([articles, true, checkTopicExists(topic)])
                }
            }
            else return [articles, true, true]
        })
        .then(([articles, userExists, topicExists]) => {
            if (!userExists) {
                return Promise.reject({ status: 404, msg: 'Author not found' });
            }
            if (!topicExists) {
                return Promise.reject({ status: 404, msg: 'Topic not found' });
            }
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
        .from('articles')
        .where('article_id', '=', article_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });
            else {

                return article[0]

            }
        })
}

exports.removeArticleById = (article_id) => {
    return connection
        .delete()
        .from('articles')
        .where('article_id', '=', article_id)
        .returning('*')
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article Not Found' });

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

exports.fetchCommentsByArticle = (article_id, sort_by, order, limit, p) => {
    if (order !== 'asc' && order !== 'desc' && order !== undefined) {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    return connection
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .from('comments')
        .where('article_id', '=', article_id)
        .orderBy(sort_by || 'created_at', order || 'desc')
        .limit(parseInt(limit) || 10)
        .modify(query => {
            if (p > 1) {
                query.offset(parseInt(limit) * parseInt(p - 1) || 10 * parseInt(p - 1))
            }
        })
        .then(comments => {
            if (comments.length === 0) return Promise.reject({ status: 404, msg: 'Not Found' });
            else return comments
        })
}