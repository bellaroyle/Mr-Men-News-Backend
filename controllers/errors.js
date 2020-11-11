

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    }
    else next(err);
}

exports.handlePSQLErrors = (err, req, res, next) => {
    const badReqCodes = ['22P02', '23503'];
    if (badReqCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad Request' })
    } else {
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

