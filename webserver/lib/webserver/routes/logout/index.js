const debug = require('debug')('linto-admin:logout')
const sha1 = require('sha1')
const middlewares = require('../../middlewares')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
    path: '/',
    method: 'get',
    requireAuth: true,
    controller: [
      async (req, res, next) => {
        if (req.session.logged == 'on') {
          req.session.destroy((err) => {
            console.error(err)
          });
        }
        res.redirect('/login')
      }
    ]
  }]
}