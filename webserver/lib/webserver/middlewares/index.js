const debug = require('debug')('linto-admin:middlewares')

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
  debug(`[${Date.now()}] new user entry on ${req.url}`)
  next()
}

function checkAuth(req, res, next) {
  if (isProduction()) {
    // If not connected
    if ((typeof (req.session.logged) == 'undefined' || req.session.logged != 'on') && req.url != '/login') {
      res.redirect('/login')
    }
    //If connected
    else if (req.session.logged == 'on' && req.url == '/login') {
      req.session.save((err) => {
        if (err && err != 'undefined') {
          console.error('Err:', err)
        }
      })
      res.redirect('/admin/linto')
    } else {
      req.session.save((err) => {
        if (err && err != 'undefined') {
          console.error('Err:', err)
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