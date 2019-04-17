const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const sha1 = require('sha1')
const randomstring = require('randomstring')
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
      path: '/getInfos',
      method: 'post',
      controller: async (req, res, next) => {
        const userHash = req.body.hash
        const user = await model.getUserByHash(userHash)
        res.json({
          user
        })
      }
    },
    {
      path: '/',
      method: 'put',
      requireAuth: true,
      controller: async (req, res, next) => {
        const data = req.body
        const userHash = data.userHash
        const getUserInfos = await model.getUserByHash(userHash)
        let payload = getUserInfos[0]
        for (let key in data) {
          payload[key] = data[key]
        }
        const updateUser = await model.updateUser(payload)
        res.json({
          'status': updateUser
        })
      }
    },
    {
      path: '/pswd',
      method: 'put',
      requireAuth: true,
      controller: async (req, res, next) => {
        const data = req.body
        const userHash = data.userHash
        const getUserInfos = await model.getUserByHash(userHash)
        let payload = getUserInfos[0]
        // Check current password
        if (sha1(data.currentPswd + payload.salt) === payload.passwordHash) {
          const newSalt = randomstring.generate(12)
          payload.salt = newSalt;
          payload.passwordHash = sha1(data.newPswd + newSalt)

          const updateUser = await model.updateUser(payload)
          if (updateUser === 'success') {
            res.json({
              status: updateUser,
              msg: 'Votre mot de passe à été modifié',
              code: 1
            })
          } else {
            res.json({
              status: updateUser,
              msg: 'Une erreur est survenue',
              code: -1
            })
          }
        } else {
          res.json({
            status: 'error',
            msg: 'Le mot de passe actuel est erroné',
            code: 0
          })
        }
      }
    },
  ]
}