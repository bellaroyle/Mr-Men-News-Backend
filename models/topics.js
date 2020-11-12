const connection = require('../connection')

exports.fetchAllTopics = () => {
    return connection
        .select('*')
        .from('topics')
        .then(topicsRows => {
            return topicsRows
        })
}

exports.checkTopicExists = (topic) => {
    return connection
        .select('*')
        .from('topics')
        .where('slug', '=', topic)
        .then(topics => {
            if (topics.length === 0) return false;
            else return true;
        })
}