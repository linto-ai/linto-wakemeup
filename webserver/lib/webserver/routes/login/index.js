const debug = require('debug')('linto-admin:login')
const sha1 = require('sha1')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
    path: '/userAuth',
    method: 'post',
    controller: async (req, res, next) => {
      if (req.body.email != "undefined" && req.body.password != "undefined") { // get post datas
        const email = req.body.email
        const password = req.body.password
        try {
          let user
          let getUser = await model.getUserByEmail(email)
          if (getUser.length > 0) {
            user = getUser[0]
          }
          console.log('>,',   user)
          if (typeof (user) === "undefined") { // User not found
            res.json({
              "status": "error",
              "msg": "user not found"
            })
          } else { // User found
            const userPswdHash = user.passwordHash
            const salt = user.salt
            // Compare password with database
            console.log()
            if (sha1(password + salt) == userPswdHash) {
              res.json({"status":"success", "msg":"password found"})
              
              // TODO > Traitement des information LOGIN
              
              /*req.session.logged = 'on'
              req.session.user = userName
              req.session.save((err) => {
                if (err) {
                  res.json({
                    "status": "error",
                    "msg": "Error on saving session"
                  })
                } else {
                  res.json({
                    "status": "success",
                    "msg": "valid"
                  }) //Valid password
                }
              })*/
            } else {
              res.json({
                "status": "error",
                "msg": "Invalid password"
              }) // Invalid password
            }
          }
        } catch (error) {
          console.error(error)
          res.json({
            "status": "error",
            "msg": error
          })
        }
      } else {
        res.json({
          "status": "error",
          "msg": "An error has occured whent trying to connect to database"
        })
      }
    }
  }]
}