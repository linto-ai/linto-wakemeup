const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/uploads`)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname)
  }
});

const upload = multer({
  storage: storage
}).any();

module.exports = (webServer) => {
  return [
    {
      path: '/',
      method: 'get',
      requireAuth: true,
      controller: async (req,res,next) => {
        const audios = await model.getAllAudios()
        res.json({ audios })
      }
    },
    {
      path: '/vote',
      method: 'post',
      requireAuth: true,
      controller: async (req,res,next) => {
        const payload = req.body
        const voteAudio = await model.updateVoteAudio(payload)
        res.json({ voteAudio })
      }
    },
    {
      path: '/save',
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
            let updateScenario = false
            let errorMsg = ''
            const userInfos = JSON.parse(req.body.userInfos)
            const webAudioInfos = JSON.parse(req.body.webAudioInfos)
            const file = req.files[0]
            
            const filePayload = {
              author: userInfos.userHash,
              wakeword: userInfos.wakeword,
              deviceType: userInfos.deviceType,
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
              status: 'vote',
              options: webAudioInfos.options,
              userVoted: [],
              gender: userInfos.gender,
              ageRange: userInfos.ageRange,
              nativeFrench: userInfos.nativeFrench,
              language: userInfos.language
            }
            
            if(filePayload.mimetype == 'audio/wav') {
              // update user records infos in DB
              const updateUserRecord = await model.updateUserRecords({userInfos})
              if(updateUserRecord.status === 'success') {
                updateUser = true
              } else {
                updateUser = false
                errorMsg += 'Error on updating user'
              }
  
              // Increment nbRecords of appStats in DB
              const updateScenarios = await model.updateScenario({wakeword: userInfos.wakeword, action: 'increment_record'})
              if(updateScenarios === 'success') {
                updateScenario = true
              } else {
                updateScenario = false
                errorMsg += 'Error on updating app stats'
              }
            } else {
              updateUser = true
              updateScenario = true
            }
            
            // Save Audio in DB
            const addFile = await model.addAudioSample(filePayload)
            if(addFile === 'success') {
              addAudioFile = true
            } else {
              addAudioFile = false
              errorMsg += 'Error on updating audio file'
            }
  
            if(addAudioFile && updateUser && updateScenario) {
              res.json({status: 'success', msg:'File has been added'})
            } else {
              res.json({status:'error', msg: errorMsg})
            }
          })
        }
      ]
    }
  ]
}