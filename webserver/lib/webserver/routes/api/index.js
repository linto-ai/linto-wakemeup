const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [
    {
      path: '/getUserInfos',
      method: 'post',
//      requireAuth: true,
      controller: async (req, res, next) => {
        const userHash = req.body.hash
        const user =  await model.getUserByHash(userHash)
        res.json({ user })
      }
    },
    {
      path: '/test',
      method: 'get',
      controller: async (req, res, next) => {
        res.json({test:'test'})
      }
    }
  ]
}