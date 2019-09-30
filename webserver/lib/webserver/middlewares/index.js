const debug = require('debug')('linto-admin:middlewares')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
  debug(`[${Date.now()}] new user entry on ${req.url}`)
  next()
}

function checkAuth(req, res, next) {
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
}

function isConnected(req, res, next) {
  if ((typeof (req.session.logged) != 'undefined' || req.session.logged == 'on')) {
    res.cookie('wmu_user', req.session.user, { expires: new Date(Date.now() + (24*60*60*1000)), })
  } else {
    res.cookie('wmu_user', 'disconnected')
  }
  next()
}

async function isAdmin(req, res, next) {
  const userHash = req.session.user
  const getUser = await model.getUserByHash(userHash)
  if(getUser[0].role === 'administrator') {
    next()
  } else {
    res.redirect('/')
  }
}
module.exports = {
  checkAuth,
  logger,
  isAdmin,
  isConnected
}