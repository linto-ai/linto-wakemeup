const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const sha1 = require('sha1')
const randomstring = require('randomstring')
const model = new DBmodel()
const mailer = require(`${process.cwd()}/lib/webserver/sendMail`)

module.exports = (webServer) => {
  return [{
    path: '/getInfos',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const userHash = req.body.hash
        const user = await model.getUserByHash(userHash)
        res.json({
          user
        })
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error
        })
      }
    }
  },
  {
    path: '/session',
    method: 'get',
    controller: async (req, res, next) => {
      try {
        console.log('route session :' , req.session)
        let response = {}
        if(!!req.session.logged && !!req.session.user) {
          const user = await model.getUserByHash(req.session.user)
          response = {
            connected: true,
            user: req.session.user,
            email: user[0].email,
            userName: user[0].userName
          }
        } else {
          response = {
            connected: false,
            user: null,
            email: null,
            userName: null
          }
        }
        res.json({ response })
      } catch (err) {
        res.json({
          status: 'error',
          error: err
        })
      }
    }
  },
  {
    path: '/',
    method: 'put',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const data = req.body
        const userHash = data.userHash
        const getUserInfos = await model.getUserByHash(userHash)
        let payload = getUserInfos[0]
        for (let key in data) {
          payload[key] = data[key]
        }

        const updateUser = await model.updateUser(payload)
        res.json({
          status: updateUser
        })
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error
        })
      }
    }
  },
  {
    path: '/',
    method: 'delete',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const userHash = req.body.userHash
        const audioList = await model.getAudiosByUserHash(userHash)
        let audioDelete = true
        for (let i in audioList) {
          let removeTrack = await model.deleteAudio(audioList[i]._id)
          if (removeTrack === 'success') {
            i++
          } else {
            audioDelete = false
          }
        }
        if (audioDelete) {
          const deleteUser = await model.deleteUser(userHash)
          if (deleteUser === 'success') {
            //  res.redirect('/logout')
            res.json({
              status: 'success',
              msg: 'l\'utilisateur à été supprimé'
            })
          }
        } else {
          throw 'error on deleting audio file'
        }
      } catch (error) {
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/userEmailExist',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const email = req.body.email
        const getUser = await model.getUserByMail(email)
        if (getUser.length > 0) {
          res.json({
            status: 'success',
            msg: 'user found'
          })
        } else {
          throw 'user not found'
        }
      } catch (error) {
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/userNameExist',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const name = req.body.name
        const getUser = await model.getUserByName(name)
        if (getUser.length > 0) {
          res.json({
            status: 'success',
            msg: 'user found'
          })
        } else {
          throw 'user not found'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/pswd',
    method: 'put',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
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
            throw 'Une erreur est survenue'
          }
        } else {
          throw 'Le mot de passe actuel est erroné'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/pswdcheck',
    method: 'post',
    requireAuth: true,
    controller: async (req, res, next) => {
      try {
        const pswd = req.body.pswd
        const userHash = req.body.userHash
        const getUserInfos = await model.getUserByHash(userHash)
        let payload = getUserInfos[0]
        // Check current password
        if (sha1(pswd + payload.salt) === payload.passwordHash) {
          res.json({
            status: 'success'
          })
        } else {
          throw 'invalid password'
        }
      } catch (error) {
        console.error(error)
        res.json({
          satus: 'error',
          error
        })
      }
    }
  },
  {
    path: '/reinitPswd',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const userHash = req.body.userHash
        const newPswd = req.body.newPswd
        const getUser = await model.getUserByHash(userHash)
        if (getUser.length > 0) {
          let user = getUser[0]
          const newSalt = randomstring.generate(12)
          const newHash = sha1(newPswd + newSalt)
          user.salt = newSalt
          user.passwordHash = newHash
          const updateUser = await model.updateUser(user)

          res.json({ status: updateUser })
        } else {
          throw 'User not found'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error
        })
      }
    }
  },
  {
    path: '/setReinit',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const email = req.body.email
        const getUser = await model.getUserByMail(email)
        if (getUser.length > 0) {
          const user = getUser[0]
          const dateExpire = new Date().getTime() + 60 * 30 * 1000;
          const expire = new Date(dateExpire)
          user.reinit = {
            resetToken: randomstring.generate(16),
            expire
          }
          const updateUser = await model.updateUser(user)
          const reinitLink = 'reinit-password/' + user.userName + '/' + user.reinit.resetToken
          const sendmail = await mailer.sendReinitPasswordMail(email, user.userName, reinitLink)
          if (sendmail === 'mailSend' && updateUser === 'success') {
            res.json({ status: 'success' })
          } else {
            let errorMsg = ''
            if (sendmail !== 'mailSend') {
              errorMsg += `Error on sending email (${sendmail}).`
            }
            if (updateUser !== 'success') {
              msg += `Error on updating database.`
            }
            throw errorMsg
          }
        } else {
          throw 'user not found'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/checkToken',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const token = req.body.token
        const userName = req.body.user
        const getUser = await model.getUserByName(userName)
        if (getUser.length > 0) {
          const user = getUser[0]
          const userToken = user.reinit.resetToken
          const expire = user.reinit.expire
          if (userToken === token) {
            const now = new Date()
            if (expire >= now) {
              res.json({
                status: 'success',
                msg: 'tokenValid',
                userHash: user.userHash
              })
            } else {
              throw 'tokenExpired'
            }
          } else {
            throw 'tokenInvalid'
          }
        } else {
          throw 'userNotFound'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  },
  {
    path: '/updateRecordList',
    method: 'put',
    controller: async (req, res, next) => {
      try {
        const userHash = req.body.userHash
        const wakeword = req.body.wakeword
        let newScenario = {
          wakeword,
          step: 0,
          complete: false
        }
        const getUser = await model.getUserByHash(userHash)
        const user = getUser[0]
        user.recordList.push(newScenario)

        const updateUser = await model.updateUser(user)

        if (updateUser === 'success') {
          res.json({ status: updateUser, msg: '' })
        } else {
         throw 'Une erreur est survenue, si le problème persiste, veuillez contactrer un administrateur.'
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          error,
          msg: error
        })
      }
    }
  }]
}