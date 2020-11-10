
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../data/index.js');

const { createArticleRef, formatCommentData, formatDate } = require('../utils/data-manipulation')

exports.seed = function (connection) {
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest()
    })
    .then(() => {
      return connection.insert(topicData).into('topics').returning('*');
    })
    .then(() => {
      return connection.insert(userData).into('users').returning('*');
    })
    .then(() => {
      const dateFormatArticle = formatDate(articleData)
      return connection.insert(dateFormatArticle).into('articles').returning('*')
    })
    .then(articleRows => {
      const articleRef = createArticleRef(articleRows)
      const formattedComment = formatCommentData(commentData, articleRef)
      return connection.insert(formattedComment).into('comments').returning('*')
    })
};
