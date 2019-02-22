/*
 * Copyright (c) 2017 Linagora.
 *
 * This file is part of Business-Logic-Server
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const debug = require("debug")("wakemeup:webserver:routes:slash")
const dbModel = require(`${process.cwd()}/model`)
const model = new dbModel()

module.exports = webServer => {
    return [{
            path: "/",
            method: "get",
            requireAuth: true,
            controller: [
                async (req, res, next) => {
                    res.redirect("/login");
                }
            ]
        },
        {
            path: "register",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {

                if (req.session.logged == "on") {

                    res.redirect("/accueil");
                } else {
                    res.render("register", {
                        title: "WakeMeUp"
                    });
                }
            }
        },
        {
            path: "login",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                console.log("cookie=" + req.cookies);
                if (req.session.logged == "on") {
                    res.redirect("/accueil");
                } else {
                    res.render("auth", {
                        title: "WakeMeUp",
                        message: "Please, login"
                    });
                }
            }
        },
        {
            path: "disconnect",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                req.session.destroy();
                res.redirect("/login");
            }
        },
        {
            path: "dataUsage",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                res.render("dataUsage", {
                    title: "Usage de vos données"
                });
            }
        },
        {
            path: "getAudio",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {


                if (req.session.lastAudio == undefined) {
                    req.session.lastAudio = 0;

                } else {
                    req.session.lastAudio = req.session.lastAudio + 1;
                }
                res.type('audio/wav');
                res.sendFile("/home/alex/wake-me-up/public/fkk.wav");
            }
        },
        {
            path: "record",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != "on") {
                    res.redirect("/login");
                } else {
                    res.render("record", {
                        title: "Record",
                        email: req.session.user[0]
                    });
                }
            }
        },
        {
            path: "accueil",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != "on") {
                    res.render("accueil", {
                        titre: "Accueil",
                        message: "coucou",
                        email: null
                    });
                } else {
                    res.render("accueil", {
                        titre: "Accueil",
                        message: "coucou",
                        email: req.session.user[0]
                    });
                }
            }
        },
        {
            path: "listen",
            method: "get",
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != "on") {
                    res.redirect("/login");
                } else {
                    res.render("listen", {
                        title: "listen",
                        message: "coucou",
                        testedHotword: "linto",
                        email: req.session.user[0]
                    });
                }
            }
        },
        {
            path: "samplevalidity",
            method: "post",
            requireAuth: false,
            controller: [
                async (req, res, next) => {

                    res.json({
                        status: "success",
                        msg: "valid"
                    });
                }
            ]
        },
        {
            path: "sendaudio",
            method: "post",
            requireAuth: false,
            controller: [
                async (req, res, next) => {

                    res.json({
                        status: "success",
                        msg: "valid"
                    });
                }
            ]
        }, {
            path: "register",
            method: "post",
            requireAuth: false,
            controller: [
                async (req, res, next) => {

                    if (!!req.body.password && !!req.body.email) {
                        try {
                            let getUser = req.body;

                            const email = getUser.email;
                            const password = getUser.password;
                            const gender = getUser.gender;

                            var isInDatabase = await model.checkUser(email);
                            if (isInDatabase) {
                                res.json({
                                    status: "found",
                                    msg: "user exist"
                                });
                                return 0;
                            } else {
                                hash = await model.createUser(email, password, gender);
                            }

                            if (getUser === getUser) {

                                req.session.logged = "on";
                                req.session.user = [email, password, hash];

                                req.session.save(err => {
                                    if (err) {
                                        res.json({
                                            status: "error",
                                            msg: "Error on saving session"
                                        });
                                    } else {
                                        var cookieOui = ["email=" + password, "hash=" + hash];
                                        res.setHeader("Set-Cookie", cookieOui);
                                        res.json({
                                            status: "success",
                                            msg: "valid"
                                        });
                                    }
                                });
                            }
                        } catch (error) {

                            debug(error);
                        }
                    } else {
                        res.status(200);
                        return res.json({
                            status: "error",
                            message: "bad request (no param found)"
                        });
                    }
                }
            ]
        },
        {
            path: "checkLogin",
            method: "post",
            requireAuth: false,
            controller: [
                async (req, res, next) => {
                    if (!!req.body.password && !!req.body.email) {
                        try {
                            let getUser = req.body;
                            const email = getUser.email;
                            const password = getUser.password;


                            //let getUser = await model.getUser(req.body.userInfo);
                            var isInDatabase = await model.checkUser(email);
                            if (isInDatabase) {
                                var isCorrect = await model.checkPassword(email, password);
                                if (isCorrect) {
                                    if (typeof password === "undefined") {
                                        // User not found
                                    } else {
                                        // User found
                                        req.session.logged = "on";
                                        req.session.user = [email, password];
                                        req.session.save(err => {
                                            if (err) {
                                                res.json({
                                                    status: "error",
                                                    msg: "Error on saving session"
                                                });
                                            } else {

                                                res.json({
                                                    status: "success",
                                                    msg: "valid"
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    res.json({
                                        status: "error",
                                        msg: "invalid password"
                                    });
                                }
                            } else {
                                res.json({
                                    status: "error",
                                    msg: "user not found"
                                });
                                return 0;
                            }

                        } catch (error) {
                            debug(error);
                        }
                    } else {
                        res.status(200);
                        return res.json({
                            status: "error",
                            message: "bad request (no param found)"
                        });
                    }
                }
            ]
        }
    ];
};

// //controleur
// async getDb(machin){
//     montrucfetché = await monModel.fetch(machin)
// }

// //model
// monModel.fetch(machin){
//     return new Promise((resolve, reject) => {
//         //db
//         return connecteurMongoDb.get(machin).then((value) => {
//             resolve(value)
//         })
//     })
// }

// //model ''

// monModel.fetch(machin){
//     return new Promise(async (resolve, reject) => {
//         //db
//         return await connecteurMongoDb.get(machin)
//     })
// }