const debug = require('debug')('linto-admin:mentions-legales')
const middlewares = require(`${process.cwd()}/lib/webserver/middlewares`)
module.exports = (webServer) => {
  return [
    {
      path: '/',
      method: 'get',
      controller: (req, res, next) => {
        res.setHeader("Content-Type", "text/html")
        res.sendFile(process.cwd() + '/dist/index.html')
      }
    }
  ]
}