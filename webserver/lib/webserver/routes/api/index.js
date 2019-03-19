const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [
    {
      path: '/getUserInfos',
      method: 'post',
      controller: async (req, res, next) => {
        const userHash = req.body.hash
        const user =  await model.getUserByHash(userHash)
        res.json({ user })
      }
    },
    {
      path: '/updateUser',
      method: 'post',
      controller: async (req, res, next) => {
        const data = req.body
        const userHash = data.emailHash
        const getUserInfos = await model.getUserByHash(userHash)
        let payload = getUserInfos[0]
        for(let key in data){
          payload[key] = data[key]
        }
        const updateUser = await model.updateUser(payload)
        res.json({'status': updateUser})
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