const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const Session = require('express-session')
const cookieParser = require('cookie-parser')
const EventEmitter = require('eventemitter3')
const HTTP_PORT = process.env.HTTP_PORT || 3003
let redis, redisStore, redisClient

if (process.env.NODE_ENV == 'production') {
  redis = require("redis")
  redisStore = require('connect-redis')(Session)
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
}
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
    this.app.use(cookieParser())

    let sessionConfig = {
      resave: false,
      saveUninitialized: true,
      secret: 'hippopoceros',
      cookie: {
        secure: false,
        maxAge: 604800 // 7 days
      }
    }
    // Redis store if "production"
    if (process.env.NODE_ENV == 'production') {
      sessionConfig.store = new redisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        client: redisClient
      })
    }

    this.session = Session(sessionConfig)
    this.app.use(this.session)

    this.httpServer = this.app.listen(HTTP_PORT, (err) => {
      if (err) console.error(err)
    })

    return this.init()
  }
  init() {
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