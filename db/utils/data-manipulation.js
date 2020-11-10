

exports.createArticleRef = (articleRows) => {
    const ref = {};
    articleRows.forEach(article => {
        ref[article.title] = article.article_id;
    })
    return ref;
}

exports.formatCommentData = (commentData, articleRef) => {
    const formattedData = commentData
        .map(({ belongs_to, created_by, created_at, ...restOfComment }) => {
            const newComment = {
                ...restOfComment,
                article_id: articleRef[belongs_to],
                author: created_by,
                created_at: new Date(created_at)
            }
            return newComment
        })
    return formattedData
}

exports.formatDate = (data) => {
    const formattedData = data
        .map(({ created_at, ...restOfData }) => {
            const newData = {
                ...restOfData,
                created_at: new Date(created_at),
            }
            return newData
        })
    return formattedData
}

/*
exports.createReference = (array, keyToAdd, valueToAdd) => {
    const ref = {};
    array.forEach((item) => {
        ref[item[keyToAdd]] = item[valueToAdd]
    })
    return ref;
}
*/

/*
exports.createAuthorRef = (userRows) => {
    const ref = {};
    userRows.forEach(user => {
        ref[user.username] = user.name;
    })
    return ref;
}

*/
