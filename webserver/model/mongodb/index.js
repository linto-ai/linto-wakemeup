const debug = require('debug')('linto-admin:model:mongodb')
const MONGODB_DBNAME = process.env.MONGODB_DBNAME
const sha1 = require('sha1')
const randomstring = require('randomstring')
const mongoDb = require("mongodb")
let urlMongo = 'mongodb://'
if (process.env.MONGODB_USER) {
  urlMongo += process.env.MONGODB_USER + ':' + process.env.MOGODB_PSWD + '@'
}
urlMongo += process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/'
if (process.env.MONGODB_USER) {
  urlMongo += '?authSource=' + process.env.MONGODB_DBNAME
}

console.log(urlMongo)
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
    } catch (error) {
      console.error(error)
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
      console.error('get user ', err)
    }
  }
  
  /**
   * Get a user from "users" collection, by its "_id" 
   * @param {string} email
   * @returns {Array|Object}
   */
  async getUserByEmail(email) {
    try {
      const query = {
        email: email
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      console.error('get user ', err)
    }
  }
  async getUserByHash(hash) {
    try {
      const query = {
        emailHash: hash
      }
      return await this.mongoRequest('users', query)
    } catch (err) {
      console.error('get user ', err)
    }
  }
  /**
   * Create a new user
   * @param {Object} payload
   * @returns {Promise}
   */
  async createUser(payload) {
    try {
      const getUser = await this.getUserByEmail(payload.email)
      if (getUser.length === 0) {
        const salt = randomstring.generate(12)
        const userPayload = {
          email : payload.email,
          passwordHash: sha1(payload.pswd + salt),
          salt: salt,
          gender: payload.gender,
          deviceType: payload.deviceType,
          firstName: '',
          lastName: '',
          ageRange: '',
          nbListen: 0,
          nbRecord: 0,
          emailHash : sha1(payload.email),
          anonymous: false
        }
        return await this.mongoInsert('users', userPayload)
        
      } else {
        return 'Cet utilisateur existe déjà'
      }

    } catch (err) {
      console.error(err)
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
      console.error(err)
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