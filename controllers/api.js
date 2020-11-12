const { fetchEndpoints } = require('../models/api')

exports.getEndpoints = (req, res, next) => {
    fetchEndpoints().then(endpoints => {
        res.status(200).send({ endpoints })
    })
}