const BDD_URI = 'mongodb://127.0.0.1';
const MONGODB_DBNAME = 'wakemeup';
const mongoDb = require("mongodb");
const bcrypt = require('bcrypt');
var sha1 = require('sha1');

class modelMongoDb {
    constructor() {
        this.bddUri = BDD_URI;
        this.mongoDb = mongoDb;
        return this;
    }
    async addWav(userID, typeMicro, filename) {
        var datas = {
            'userID': userID,
            'micro': typeMicro,
            'filename': filename
        };

    }
    async test() {
        return await this.mongoRequest('test', {})
    }
    async essay(id) {
        const query = {
            _id: this.mongoDb.ObjectID(id)
        }
        return await this.mongoRequest('test', query)
    }

    async checkUser(email) {
        const getuser = await this.mongoRequest('users', {
            email: email
        });
        if (getuser.length > 0) {
            console.log('found > ', getuser)
            return true;
        } else {
            console.log('not found')
            return false;
        }


    }
    async createUser(userEmail, userPassword, userGender) {
        let userSalt = Math.random();
        console.log(userSalt)
        let saltedPassword = userSalt + userPassword;
        let userHash = sha1(saltedPassword);
        console.log('mot de passe haché : ', userHash);

        const userDatas = {
            email: userEmail,
            hash: userHash,
            gender: userGender,
            salt: userSalt
        };

        await this.mongoInsert('users', userDatas);
        return userHash;
    }







    async checkPassword(userEmail, userPassword) {
        let saltedPassword = "sel" + userPassword;
        let getUser = await this.mongoRequest('users', {
            email: userEmail
        });
        const user = getUser[0]
        saltedPassword = user.salt + userPassword;
        let hashedSaltedPassword = sha1(saltedPassword);
        //let hash = await user.hash

        if (user.hash === hashedSaltedPassword) {
            console.log(user.hash, hashedSaltedPassword);
            return true;
        } else {
            return false;
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
                this.mongoDb.MongoClient.connect(this.bddUri, {
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
                        });
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
                this.mongoDb.MongoClient.connect(this.bddUri, {
                    useNewUrlParser: true
                }, (err, db) => {
                    if (err) {
                        reject(err)
                    } else {
                        const dbo = db.db(MONGODB_DBNAME);
                        dbo.collection(collection).insertOne(payload, function (err, res) {
                            if (err) throw err;
                            db.close();
                            resolve('success');
                        });

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
                this.mongoDb.MongoClient.connect(this.bddUri, {
                    useNewUrlParser: true
                }, (err, db) => {
                    if (err) {
                        reject(err)
                    } else {
                        const dbo = db.db(MONGODB_DBNAME);
                        dbo.collection(collection).find(query).toArray((err, result) => {
                            if (err) throw err;
                            db.close();
                            resolve(result);
                        });
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
                this.mongoDb.MongoClient.connect(this.bddUri, {
                    useNewUrlParser: true
                }, (err, db) => {
                    if (err) {
                        reject(err)
                    } else {
                        const dbo = db.db(MONGODB_DBNAME);
                        dbo.collection(collection).deleteOne(query, function (err, obj) {
                            if (err) throw err;
                            db.close();
                            resolve("success");
                        });
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = modelMongoDb



/*class MongoModel {
    constructor() {
        this.bddUri = process.env.BDD_URI;
        this.mongoDb = mongoDb;
        const url = 'mongodb://127.0.0.1';
        const dbName = 'wakemeup';
        const client = new mongoDb(url);
        this.mongoDb(function (err) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbName);

            insertDocuments(db, function () {
                console.log("");
                client.close();
            });
        });
    }

    async createUser(firstname, lastname, gender) {
        var lastUserId;
        if (!!lastUserId) {
            console.log(this.lastUserId)
        } else {
            lastUserId = 0;

        }

        db.collection("customers").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
        return userID;

    };
    async getUser() {

        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}

module.exports = new MongoModel();*/