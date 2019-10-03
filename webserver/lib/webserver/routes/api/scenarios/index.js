const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const sha1 = require('sha1')
const randomstring = require('randomstring')
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
    path: '/',
    method: 'get',
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
    method: 'put',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const payload = req.body
        const updateScenario = await model.updateScenario(payload)
        res.json({
          status: updateScenario,
          msg: `Le mot-clé "${payload.wakeword}" a été mis à jour`
        })
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          msg: 'Error on updating Validation goal value'
        })
      }
    }
  }]
}