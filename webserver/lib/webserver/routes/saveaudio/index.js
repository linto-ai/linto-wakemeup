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
        upload(req, res, async (err) => {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.json({'status': 'error'})
          } else if (err) {
            // An unknown error occurred when uploading.
            res.json({'status': 'error'})
          }
          let updateUser = false
          let addAudioFile = false
          let errorMsg = ''
          const userInfos = JSON.parse(req.body.userInfos)
          const webAudioInfos = JSON.parse(req.body.webAudioInfos)
          const file = req.files[0]
          
          const filePayload = {
            author: userInfos.userHash,
            wakeword: userInfos.wakeword,
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            destination: file.destination,
            path: file.path,
            size: file.size,
            sampleRate: webAudioInfos.contextSampleRate || 'not set',
            buffersize: webAudioInfos.bufferSize || 'not set',
            nbChannels: webAudioInfos.nbChannels || 'not set',
            nbVotes: 0,
            nbValidVote: 0,
            nbInvalidVote: 0,
            status: 'vote'
          }
          
          if(filePayload.mimetype == 'audio/wav'){
            const updateUserRecord = await model.updateUserRecords({userInfos})
            if(updateUserRecord.status === 'success'){
              updateUser = true
            } else {
              updateUser = false
              errorMsg += 'Error on updating user'
            }
          } else {
            updateUser = true
          }

          const addFile = await model.addAudioSample(filePayload)
          if(addFile === 'success'){
            addAudioFile = true
          } else {
            addAudioFile = false
            errorMsg += 'Error on updating audio file'
          }
          
          if(addAudioFile && updateUser) {
            res.json({status: 'success', msg:'File has been added'})
          } else {
            res.json({status:'error', msg: errorMsg})
          }
        })
      }
    ]
  }]
}