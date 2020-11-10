const connection = require('../connection')

exports.fetchUserByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', username)
        .then(user => {
            if (user.length === 0) return Promise.reject({ status: 404, msg: 'User Not Found' });
            else return user[0];
        })
}