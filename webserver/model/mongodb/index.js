const debug = require('debug')('linto-admin:model:mongodb')
const MONGODB_DBNAME = process.env.MONGODB_DBNAME
const sha1 = require('sha1')
const randomstring = require('randomstring')
const mongoDb = require("mongodb")
const fs = require('fs')
let urlMongo = 'mongodb://'

if (process.env.MONGODB_USER) {
  urlMongo += process.env.MONGODB_USER + ':' + process.env.MOGODB_PSWD + '@'
}
urlMongo += process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/'
if (process.env.MONGODB_USER) {
  urlMongo += '?authSource=' + process.env.MONGODB_DBNAME
}

const moveFile = function (file) {
  try {
    //gets file name and adds it to dir2
    const status = file.status
    const newPath = file.destination + '/' + status + '/' + file.fieldname
    fs.rename(file.path, newPath, (err) => {
      if (err) {
        console.error(err)
        throw err
      }
    })
    return {
      status: 'success',
      path: newPath,
      dest: file.destination + '/' + status
    }
  } catch (error) {
    return {
      status: 'error',
      error
    }
  }
}

class modelMongoDb {
  constructor() {
    this.mongoDb = mongoDb
    this.urlMongo = urlMongo
    this.client = mongoDb.MongoClient
    return this
  }

  /*************/
  /*** USERS ***/
  /*************/
  /**
   * Get all users from "users" collection
   * @returns {Array|Object}
   */
  async getUsers() {
    try {
      const query = {}
      return await this.mongoRequest('users', query)
    } catch (err) {
      return err
    }
  }

  /**
   * Get a user from "users" collection, by its "_id"
   * @param {string} id
   * @returns {Array|Object}
   */
  async getUser(id) {
    try {
      const query = {
        _id: this.mongoDb.ObjectID(id)
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      return err
    }
  }

  /**
   * Get a user from "users" collection, by its "_id"
   * @param {string} name
   * @returns {Array|Object}
   */
  async getUserByName(userName) {
    try {
      const query = {
        userName: userName
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      return err
    }
  }
  async getUserByMail(email) {
    try {
      const query = {
        email
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      return err
    }
  }

  async getUserByHash(hash) {
    try {
      const query = {
        userHash: hash
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      return err
    }
  }
  /**
   * Create a new user
   * @param {Object} payload
   * @returns {Promise}
   */
  async createUser(payload) {
    try {
      const getUser = await this.getUserByName(payload.userName)
      if (getUser.length === 0) {
        const salt = randomstring.generate(12)
        const userPayload = {
          userName: payload.userName,
          email: payload.email,
          passwordHash: sha1(payload.pswd + salt),
          salt: salt,
          gender: payload.gender,
          deviceType: payload.deviceType,
          ageRange: payload.userAgeRange,
          userHash: sha1(payload.userName),
          language: payload.language,
          nativeFrench: payload.nativeFrench,
          recordList: [],
          nbListen: 0,
          nbRecord: 0,
          role: 'user',
          reinit: {}
        }
        return await this.mongoInsert('users', userPayload)

      } else {
        return 'userExist'
      }
    } catch (err) {
      return err
    }
  }
  /**
   * Update user datas
   * @param {Object} payload
   * @returns {Promise}
   */
  async updateUser(payload) {
    try {
      const query = {
        _id: this.mongoDb.ObjectID(payload._id)
      }
      let mutableElements = payload
      delete mutableElements._id
      return await this.mongoUpdate('users', query, mutableElements)
    } catch (err) {
      return err
    }
  }
  async updateUserRecords(payload) {
    try {
      const userHash = payload.userInfos.userHash
      const wakeword = payload.userInfos.wakeword
      const step = payload.userInfos.step
      const getUser = await this.getUserByHash(userHash)
      const user = getUser[0]
      let userRecord = user.recordList
      if (userRecord.length > 0) {
        let wwFound = false
        userRecord.map(ur => {
          if (ur.wakeword == wakeword) {
            wwFound = true
            ur.step = step
            if (step == 3) {
              ur.complete = true
            }
          }
        })
        if (!wwFound) {
          userRecord.push({ wakeword, step, complete: false })
        }
      } else {
        userRecord.push({ wakeword, step, complete: false })
      }
      user.recordList = userRecord
      user.nbRecord += 1
      const updateUser = await this.updateUser(user)
      if (updateUser === 'success') {
        return {
          status: 'success',
          msg: 'User datas has been updated'
        }
      } else {
        return {
          status: 'error',
          msg: 'Error on updating user datas'
        }
      }
    } catch (err) {
      return err
    }
  }

  async deleteUser(userHash) {
    try {
      const query = { userHash }
      const deleteUser = await this.mongoDelete('users', query)
      return deleteUser
    } catch (err) {
      return err
    }
  }
  /**************/
  /*** Audios ***/
  /*************/
  async getAllAudios() {
    try {
      const query = {}
      const allAudios = await this.mongoRequest('audios', query)
      return allAudios
    } catch (err) {
      return err
    }
  }
  async getAudioVotes(payload) {
    try {
      const query = {
        options: 'noOpt',
        mimetype: 'audio/wav',
        status: 'vote',
      }
      return await this.mongoRequest('audios', query)
    } catch (err) {
      return err
    }
  }
  async addAudioSample(payload) {
    try {
      return await this.mongoInsert('audios', payload)
    } catch (err) {
      return err
    }
  }
  async getAudioById(id) {
    try {
      const query = {
        _id: this.mongoDb.ObjectID(id)
      }
      return await this.mongoRequest('audios', query)
    } catch (err) {
      return err
    }
  }
  async getAudiosByUserHash(userHash) {
    try {
      const query = {
        author: userHash
      }
      return await this.mongoRequest('audios', query)
    } catch (err) {
      return err
    }
  }
  async getVoteLimit () {
    const query = {}
    return await this.mongoRequest('audioVoteLimit', query)
  }
  async updateVoteLimit (value) {
    try {
      const voteLimit = await this.getVoteLimit()
      const id = voteLimit[0]._id
      const query = {
        _id: this.mongoDb.ObjectID(id)
      }
      const payload = {limit: value}

      return await this.mongoUpdate('audioVoteLimit', query, payload)
    } catch (error) {
      return error
    }
  }
  async updateVoteAudio(payload) {
    try {
      const getAudio = await this.getAudioById(payload.audioId)
      const getUser = await this.getUserByHash(payload.userHash)
      const getVoteLimit =  await this.getVoteLimit()
      const voteLimit = getVoteLimit[0].limit || 3
      let fileMove = null
      let user = getUser[0]
      let audioPayload = getAudio[0]
      user.nbListen += 1
      audioPayload.userVoted.push(payload.userHash)
      audioPayload.nbVotes += 1
      if (payload.vote === 'good') {
        audioPayload.nbValidVote += 1
      } else if (payload.vote === 'bad') {
        audioPayload.nbInvalidVote += 1
      }
      if (audioPayload.nbValidVote >= voteLimit) {
        audioPayload.status = 'valid'
      }
      if (audioPayload.nbInvalidVote >= voteLimit) {
        audioPayload.status = 'invalid'
      }
      const audioQuery = {
        _id: this.mongoDb.ObjectID(payload.audioId)
      }
      if (!!audioPayload._id) {
        delete audioPayload._id
      }
      if (audioPayload.status !== 'vote') {
        fileMove = moveFile(audioPayload)
        if (fileMove.status === 'success') {
          audioPayload.path = fileMove.path
          audioPayload.destination = fileMove.dest
        } else {
          return 'error on moving file'
        }
      }
      const updateAudio = await this.mongoUpdate('audios', audioQuery, audioPayload)
      const updateUser = await this.updateUser(user)
      const updateScenarios = await this.updateScenario({ wakeword: payload.wakeword, action: 'increment_listen' })

      if (updateAudio === 'success' && updateUser === 'success' && updateScenarios === 'success') {
        return 'success'
      } else {
        return 'error'
      }
    } catch (err) {
      return err
    }
  }

  async deleteAudio(audioId) {
    try {
      const query = {
        _id: this.mongoDb.ObjectID(audioId)
      }
      const audio = await this.getAudioById(audioId)
      const path = audio[0].path
      fs.unlink(path, (err) => {
        if (err) {
          throw err
        }
      })
      const deleteAudio = await this.mongoDelete('audios', query)
      return deleteAudio
    } catch (err) {
      return err
    }
  }
  /*****************/
  /*** Scenarios ***/
  /*****************/
  async getScenarios() {
    try {
      const query = {}
      return await this.mongoRequest('scenarios', query)
    } catch (err) {
      return err
    }
  }
  async getScenarioByWakeword(wakeword) {
    try {
      const query = { wakeword: wakeword }
      return await this.mongoRequest('scenarios', query)
    } catch (err) {
      return err
    }
  }
  async addScenario(data) {
    try {
      const payload = {
        wakeword: data.wakeword,
        scenario: {
          noOpt: {
            step: 1,
            echoCancellation: true,
            noiseSuppression: true
          },
          echoCancel: {
            step: 2,
            echoCancellation: true,
            noiseSuppression: false
          },
          noiseSuppr: {
            step: 3,
            echoCancellation: false,
            noiseSuppression: true
          }
        },
        nbListen: 0,
        nbRecord: 0
      }
      return await this.mongoInsert('scenarios', payload)
    } catch (err) {
      return err
    }
  }
  async deleteWakeword(data) {
    const query = {
      wakeword: data.wakeword
    }
    return await this.mongoDelete('scenarios', query)
  }
  async updateScenario(data) {
    try {
      const wakeword = data.wakeword
      const action = data.action
      const getScenario = await this.getScenarioByWakeword(wakeword)
      const scenario = getScenario[0]
      if (action === 'increment_listen') {
        scenario.nbListen += 1
      } else if (action === 'increment_record') {
        scenario.nbRecord += 1
      }
      const query = {
        wakeword: wakeword
      }
      if (!!scenario._id) {
        delete scenario._id
      }
      return await this.mongoUpdate('scenarios', query, scenario)

    } catch (err) {
      return err
    }

  }
  /************/
  /*** APP ***/
  /************/

  async getAppStats() {
    try {
      const query = {}
      const appStats = await this.mongoRequest('app_stats', query)
      return appStats[0]
    } catch (err) {
      return err
    }
  }

  async updateAppStats(payload) {
    try {
      const appStats = await this.getAppStats()
      if (payload.target === 'nbListen') {
        appStats.nbListen += 1
      } else if (payload.target === 'nbRecord') {
        appStats.nbRecord += 1
      }
      const query = {
        _id: this.mongoDb.ObjectID(appStats._id)
      }
      if (!!appStats._id) {
        delete appStats._id
      }
      return await this.mongoUpdate('app_stats', query, appStats)
    } catch (err) {
      return err
    }
  }


  /*******************/
  /*** Mongo CRUD ***/
  /******************/
  /**
   * Update function for mongoDB. This function will update an entry based on the "collection", the "query" and the "values" passed in parmaters.
   * @param {string} collection
   * @param {Object} query
   * @param {Object} values
   * @returns {Pomise}
   */
  async mongoUpdate(collection, query, values) {
    if (values._id) {
      delete values._id
    }
    return new Promise((resolve, reject) => {
      try {
        this.mongoDb.MongoClient.connect(this.urlMongo, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) {
            reject(err)
          } else {
            const dbo = db.db(MONGODB_DBNAME)
            dbo.collection(collection).updateOne(query, {
              $set: values
            }, function (err, res) {
              if (err) throw err
              db.close()
              resolve('success')
            })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Insert/Create function for mongoDB. This function will create an entry based on the "collection", the "query" and the "values" passed in parmaters.
   * @param {string} collection
   * @param {Object} query
   * @param {Object} values
   * @returns {Pomise}
   */
  async mongoInsert(collection, payload) {
    return new Promise((resolve, reject) => {
      try {
        this.mongoDb.MongoClient.connect(this.urlMongo, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) {
            reject(err)
          } else {
            const dbo = db.db(MONGODB_DBNAME)
            dbo.collection(collection).insertOne(payload, function (err, res) {
              if (err) throw err
              db.close()
              resolve('success')
            })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Request function for mongoDB. This function will make a request on the "collection", filtered by the "query" passed in paramters.
   * @param {string} collection
   * @param {Object} query
   * @returns {Pomise}
   */
  async mongoRequest(collection, query) {
    return new Promise((resolve, reject) => {
      try {
        this.mongoDb.MongoClient.connect(this.urlMongo, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) {
            reject(err)
          } else {
            const dbo = db.db(MONGODB_DBNAME)
            dbo.collection(collection).find(query).toArray((err, result) => {
              if (err) throw err
              db.close()
              resolve(result)
            })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Delete function for mongoDB. This function will create an entry based on the "collection", the "query" passed in parmaters.
   * @param {string} collection
   * @param {Object} query
   * @returns {Pomise}
   */
  async mongoDelete(collection, query) {
    return new Promise((resolve, reject) => {
      try {
        this.mongoDb.MongoClient.connect(this.urlMongo, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) {
            reject(err)
          } else {
            const dbo = db.db(MONGODB_DBNAME)
            dbo.collection(collection).deleteOne(query, function (err, obj) {
              if (err) throw err
              db.close()
              resolve("success")
            })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = modelMongoDb