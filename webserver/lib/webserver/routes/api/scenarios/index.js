const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const sha1 = require('sha1')
const randomstring = require('randomstring')
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
    path: '/',
    method: 'get',
    requireAuth: true,
    controller: async (req, res, next) => {
      const scenarios = await model.getScenarios()
      res.json({
        scenarios
      })
    }
  },
  {
    path: '/',
    method: 'post',
    requireAuth: true,
    controller: async (req, res, next) => {
      const payload = req.body
      const addWakeword = await model.postScenario(payload)
      res.json({
        addWakeword
      })

    }
  },
  {
    path: '/',
    method: 'delete',
    requireAuth: true,
    controller: async (req, res, next) => {
      const payload = req.body
      const deleteWakeword = await model.deleteWakeword(payload)
      res.json({
        deleteWakeword
      })
    }
  }]
}