const debug = require('debug')('linto-admin:api')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [
    {
      path: '/',
      method: 'get',
      requireAuth: true,
      controller: async (req,res,next) => {
        const audios = await model.getVotingAudios()
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
    }
  ]
}