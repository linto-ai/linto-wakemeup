const debug = require('debug')('wakemeup:middlewares')

function isProduction() {
    return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
    debug(`[${Date.now()}] new user entry on ${req.url}`)
    next()
}

module.exports = {
    logger
}