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
    if ((typeof (req.session.logged) == 'undefined' || req.session.logged != 'on')) {
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
  } else {
    next()
  }
}

function isConnected(req, res, next) {
  if ((typeof (req.session.logged) != 'undefined' || req.session.logged == 'on')) {
    res.cookie('wmu_user', req.session.user)
  } else {
    res.cookie('wmu_user', 'disconnected')
  }
  next()
}

function isAdmin(req, res, next) {
  console.log(req.session)
  next()
}
module.exports = {
  checkAuth,
  logger,
  isAdmin,
  isConnected
}