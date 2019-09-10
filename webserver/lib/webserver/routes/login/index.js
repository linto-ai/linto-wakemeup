const debug = require('debug')('linto-admin:login')
const sha1 = require('sha1')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

const isEmail = email => {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
}

module.exports = (webServer) => {
  return [{
    path: '/userAuth',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
          const userName = req.body.userName
          const password = req.body.password
          let getUser
          let user
          if (isEmail(userName)) {
            getUser = await model.getUserByMail(userName)
          } else {
            getUser = await model.getUserByName(userName)
          }
          if (getUser.length > 0) {
            user = getUser[0]
          }
          if (typeof (user) === 'undefined') { // User not found
            throw {
              field: 'user',
              msg: 'Utilisateur non trouvé'
            }
          } else { // User found
            const userPswdHash = user.passwordHash
            const salt = user.salt
            // Compare password with database
            if (sha1(password + salt) == userPswdHash) {
              req.session.logged = 'on'
              req.session.user = user.userHash
              req.session.email = user.email
              req.session.userName = user.userName
              req.session.save((err) => {
                if (err) {
                  throw {
                    field: "global",
                    msg: "Error on saving session"
                  }
                } else {
                  //Valid password
                  res.json({
                    status: "success",
                    field: "global",
                    msg: "valid",
                    userHash: user.userHash
                  })
                }
              })
            } else {
              // Invalid password
              throw {
                field: "password",
                msg: "Mot de passe incorrect"
              }
            }
          }
        } else {
          throw {
            field: "global",
            msg: "Erreur lors de la connexion à la base de données"
          }
        }
      } catch (error) {
        res.json({
          status: 'error',
          msg: error.msg,
          field: error.field
        })
      }
    }
  },
  {
    path: '/createUser',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        const userInfos = req.body
        const createUser = await model.createUser(userInfos)
        if (createUser === 'success') {
          const getUser = await model.getUserByName(userInfos.userName)
          req.session.logged = 'on'
          req.session.user = getUser[0].userHash
          res.session.email = getUser[0].email
          req.session.userName = getUser[0].userName
          req.session.save((err) => {
            if (err) {
              res.json({
                status: "error",
                msg: "Error on saving session",
                code: "globalError"
              })
            } else {
              res.json({
                status: 'success',
                msg: 'Compte créé avec succès',
                userHash: getUser[0].userHash,
                code: "success"
              })
            }
          })
        }
        else if (createUser === 'userExist') {
          throw {
            msg: 'Ce nom d\'utilisateur est déjà utilisé',
            code: 'userExist'
          }
        }
        else {
          throw {
            msg: createUser
          }
        }
      } catch (error) {
        console.error(error)
        res.json({
          status: 'error',
          msg: error.msg,
          code: error.code ||'undefined'
        })
      }
    }
  }]
}