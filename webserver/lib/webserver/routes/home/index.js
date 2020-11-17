const debug = require('debug')('linto-admin:home')
const middlewares = require(`${process.cwd()}/lib/webserver/middlewares`)
module.exports = (webServer) => {
    return [{
        path: '/',
        method: 'get',
        controller: async(req, res, next) => {
            res.sendFile(process.cwd() + '/dist/index.html')
        }
    }]
}