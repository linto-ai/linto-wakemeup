const mongoDb = require("mongodb")
class MongoModel {
    constructor() {
        this.bddUri = process.env.BDD_URI;
        this.mongoDb = mongoDb;
    }

    async createUser(firstname, lastname, gender) {


        return userID;

    };
    async getUser() {

        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}

module.exports = new MongoModel();