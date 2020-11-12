const fs = require('fs').promises

exports.fetchEndpoints = () => {
    return fs.readFile('endpoints.json', 'utf8')
}