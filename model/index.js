const BDD_URI = 'mongodb://127.0.0.1';
const MONGODB_DBNAME = 'wakemeup';
const mongoDb = require("mongodb");

class modelMongoDb {
    constructor() {
        this.bddUri = BDD_URI;
        this.mongoDb = mongoDb;
        return this;
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

    async checkUser(userFirstName, userLastName) {
        const getuser = await this.mongoRequest('users', {
            firstname: userFirstName,
            lastname: userLastName
        });
        if (getuser.length > 0) {
            console.log('found > ', getuser)
            return true;
        } else {
            console.log('not found')
            return false;
        }
        /*if ( ) {
            console.log(await this.mongoRequest('users', {
                firstname: userFirstName,
                lastname: userLastName
            })[0]);
            return true;
        } else {
            console.log("user not found \nInserting dat data in dat database");
            console.log(await this.mongoRequest('users', {
                "firstname": userFirstName
            }));

            return false;
        }*/



    }
    async createUser(userFirstName, userLastName, userGender) {
        var userDatas = {
            firstname: userFirstName,
            lastname: userLastName,
            gender: userGender
        }
        await this.mongoInsert('users', userDatas);
        console.log("therWeGo");
        return 0;
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