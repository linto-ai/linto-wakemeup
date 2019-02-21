const debug = require('debug')('wakemeup:middlewares')

function isProduction() {
    return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
    debug(`[${Date.now()}] new user ${req.method} entry on ${req.url}`)
    next()
}



function createFileName(userFirstname, userLastname, userGender, userMicroType) {
    var fileName = userFirstname + "_" +
        userLastname + "_" +
        userGender + "_" +
        userMicroType + ".wav";
    return fileName;
}



function checkAuth(req, res, next) {
    if (isProduction()) {
        // If not connected, redirects to login page
        if ((typeof (req.session.logged) == 'undefined' || req.session.logged != 'on') && req.url != '/login') {
            res.redirect('/login')
        }
        //If connected
        else if (req.session.logged == 'on' && req.url == '/login') {
            req.session.save((err) => {
                if (err && err != 'undefined') {
                    console.error('Session save error:', err)
                }
            })
            res.redirect('/')
        } else {
            req.session.save((err) => {
                if (err && err != 'undefined') {
                    console.error('Session save error:', err)
                }
            })
            next()
        }
    } else {
        next()
    }
}
module.exports = {
    checkAuth,
    logger
}