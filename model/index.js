const mongoDb = require("mongodb")
class MongoModel {
    constructor() {
        this.bddUri = process.env.BDD_URI
        this.mongoDb = mongoDb
    }
    async getUser() {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }
}

module.exports = new MongoModel()