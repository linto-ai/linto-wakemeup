const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const HTTP_PORT = process.env.HTTP_PORT || 3003
const EventEmitter = require('eventemitter3')

class WebServer extends EventEmitter {
  constructor() {
    super()
    this.app = express()
    this.app.set('etag', false)
    this.app.set('trust proxy', true)
    this.app.use('/assets', express.static(path.resolve(__dirname, '../../dist')))


    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    
    this.httpServer = this.app.listen(HTTP_PORT, (err) => {
      if (err) console.error(err)
    })

    return this.init()
  }
  init () {
    require('./routes')(this)

    this.app.use((req, res, next) => {
      res.status(404)
      res.end()
    })

    this.app.use((err, req, res, next) => {
      console.error(err)
      res.status(500)
      res.end()
    })
    return this
  }
}

module.exports = new WebServer()
