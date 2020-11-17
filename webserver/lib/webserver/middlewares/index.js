const debug = require('debug')('linto-admin:middlewares')

function logger(req, res, next) {
    debug(`[${Date.now()}] new user entry on ${req.url}`)
    next()
}

function checkAuth(req, res, next) {
    // If not connected
    if ((typeof(req.session.logged) == 'undefined' || req.session.logged != 'on')) {
        res.redirect('/')
    }
    //If connected
    else if (req.session.logged == 'on') {
        req.session.save((err) => {
            if (err && err != 'undefined') {
                console.error('Err:', err)
            }
        })
        next()
    }
}

module.exports = {
    checkAuth,
    logger
}