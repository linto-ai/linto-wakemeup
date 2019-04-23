const debug = require('debug')('linto-admin:login')
const sha1 = require('sha1')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
      path: '/userAuth',
      method: 'post',
      controller: async (req, res, next) => {
        if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
          const userName = req.body.userName
          const password = req.body.password
          try {
            let user
            let getUser = await model.getUserByName(userName)
            if (getUser.length > 0) {
              user = getUser[0]
            }
            if (typeof (user) === "undefined") { // User not found
              res.json({
                "status": "error",
                "field": "user",
                "msg": "Utilisateur non trouvé"
              })
            } else { // User found
              const userPswdHash = user.passwordHash
              const salt = user.salt
              // Compare password with database
              if (sha1(password + salt) == userPswdHash) {
                req.session.logged = 'on'
                req.session.user = user.userHash
                req.session.save((err) => {
                  if (err) {
                    res.json({
                      "status": "error",
                      "field": "global",
                      "msg": "Error on saving session"
                    })
                  } else {
                    //Valid password
                    res.json({
                      "status": "success",
                      "field": "global",
                      "msg": "valid",
                      "userHash": user.userHash
                    })
                  }
                })
              } else {
                // Invalid password
                res.json({
                  "status": "error",
                  "field": "password",
                  "msg": "Mot de passe incorrect"
                })
              }
            }
          } catch (error) {
            console.error(error)
            res.json({
              "status": "error",
              "field": "global",
              "msg": error
            })
          }
        } else {
          res.json({
            "status": "error",
            "field": "global",
            "msg": "Erreur lors de la connexion à la base de données"
          })
        }
      }
    },
    {
      path: '/createUser',
      method: 'post',
      controller: async (req, res, next) => {
        const userInfos = req.body
        const createUser = await model.createUser(userInfos)
        if (createUser === 'success') {
          const getUser = await model.getUserByName(userInfos.userName)
          req.session.logged = 'on'
          req.session.user = getUser[0].userHash
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
          res.json({
            status: 'error',
            msg: 'Ce nom d\'utilisateur est déjà utilisé',
            code: 'userExist'
          })
        }
        else {
          res.json({
            status: 'error',
            msg: createUser
          })
        }
      }
    },
    
    
  ]
}