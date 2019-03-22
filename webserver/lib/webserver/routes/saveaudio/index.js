const debug = require('debug')('linto-admin:interface')
const middlewares = require(`${process.cwd()}/lib/webserver/middlewares`)
const multer = require('multer')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/uploads`)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname)
  }
});
var upload = multer({
  storage: storage
}).any();

module.exports = (webServer) => {
  return [{
    path: '/',
    method: 'post',
    requireAuth: true,
    controller: [
      async (req, res, next) => {
        upload(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer Error: ' + err)
            res.json({
              status: 'error'
            })
          } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown Error: ' + err)
            res.json({
              status: 'error'
            })
          }
          const userInfos = req.body.userInfos
          const webAudioInfos = req.body.webAudioInfos
          /*[ 
              { 
                fieldname: '01',
                originalname: '01',
                encoding: '7bit',
                mimetype: 'audio/wav',
                destination:
                '/home/rlopez/projects/linagora/wake-me-up/webserver/uploads',
                filename: '01-1553248431964.wav',
                path:
                '/home/rlopez/projects/linagora/wake-me-up/webserver/uploads/01-1553248431964.wav',
                size: 458796 
              } 
            ]*/

          res.json({
            status: 'success'
          })
          // Everything went fine.
        })
      }
    ]
  }]
}