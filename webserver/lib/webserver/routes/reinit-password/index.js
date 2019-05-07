const debug = require('debug')('linto-admin:reinit-password')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [
    {
      path: '/',
      method: 'get',
      controller: (req, res, next) => {
        res.setHeader("Content-Type", "text/html")
        res.sendFile(process.cwd() + '/dist/index.html')
      }
    },
    {
      path: '/:user/:token',
      method: 'get',
      controller: async (req, res, next) => {
        const user = req.params.user
        const getUser = await model.getUserByName(user)
        if (getUser.length <= 0){
          res.redirect('/')
        } else {
          res.setHeader("Content-Type", "text/html")
          res.sendFile(process.cwd() + '/dist/index.html')
        }
      }
    }
  ]
}