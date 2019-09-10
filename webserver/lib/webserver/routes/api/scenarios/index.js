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
      try {
        const scenarios = await model.getScenarios()
        res.json({
          scenarios
        })
      } catch (error) {
        console.error(error)
        res.json({ error })
      }
    }
  },
  {
    path: '/',
    method: 'post',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const payload = req.body
        const addWakeword = await model.addScenario(payload)
        res.json({
          addWakeword
        })
      } catch (error) {
        console.error(error)
        res.json({ error })
      }
    }
  },
  {
    path: '/',
    method: 'delete',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const payload = req.body
        const deleteWakeword = await model.deleteWakeword(payload)
        res.json({
          deleteWakeword
        })
      } catch (error) {
        console.error(error)
        res.json({ error })
      }
    }
  }]
}