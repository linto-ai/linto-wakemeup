const debug = require('debug')('linto-admin:interface')
const middlewares = require(`${process.cwd()}/lib/webserver/middlewares`)

module.exports = (webServer) => {
  return [
    {
      path: '/*',
      method: 'get',
      requireAuth: true,
      controller:[
        (req, res, next) => {
          middlewares.isConnected(req, res, next)
        },
        async (req, res, next) => {
          res.setHeader("Content-Type", "text/html")
          res.sendFile(process.cwd() + '/dist/index.html')
        }
      ] 
    }
  ]
}