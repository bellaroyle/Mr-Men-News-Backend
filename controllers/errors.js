exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    }
    else next(err);
}

exports.handlePSQLErrors = (err, req, res, next) => {

    const badReqCodes400 = ['22P02', '42703'];
    const notFoundCodes404 = ['23503']
    if (badReqCodes400.includes(err.code)) {
        res.status(400).send({ msg: 'Bad Request' })
    }
    else if (notFoundCodes404.includes(err.code)) {
        res.status(404).send({ msg: 'Not Found' })
    }
    else {
        next(err);
    }
}

exports.handleInternalErrors = (err, req, res, next) => {
    console.log(err, '<----- err')
    res.status(500).send({ msg: 'Internal Server Error' })
}
exports.send405 = (req, res, next) => {
    res.status(405).send({ msg: 'Invalid Method' });
}

exports.send404 = (req, res, next) => {
    res.status(404).send({ msg: 'Route Not Found' });
}

