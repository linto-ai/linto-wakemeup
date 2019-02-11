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
const debug = require('debug')('wakemeup:webserver:routes:slash')
const model = require(`${process.cwd()}/model`);

module.exports = (webServer) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: [
                async (req, res, next) => {
                    res.redirect('/login');

                }
            ]
        },

        {
            path: 'login',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {

                console.log("cookie=" + req.cookies);
                if (req.session.logged == 'on') {
                    res.redirect('/accueil');
                } else {
                    res.render('auth', {
                        title: 'WakeMeUp',
                        message: 'Please, login'
                    });
                }
            }
        },
        {
            path: 'disconnect',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                req.session.destroy();
                res.redirect('/login');

            }
        },
        {
            path: 'dataUsage',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                res.render('dataUsage', {
                    title: 'Usage de vos données'
                })


            }
        },
        {
            path: 'getAudio',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                console.log(req.headers.data);
                //res.set('Content-Type', 'audio/wav');


            }
        },
        {
            path: 'record',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != 'on') {
                    res.redirect('/login')
                } else {
                    res.render('record', {
                        title: 'Record',
                        message: 'coucou',
                        lastName: req.session.user[0],
                        firstName: req.session.user[1]
                    })
                }
            }
        },
        {
            path: 'accueil',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != 'on') {
                    res.render('accueil', {
                        title: 'Accueil',
                        message: 'coucou',
                        lastName: null,
                        firstName: null
                    })
                } else {
                    res.render('accueil', {
                        title: 'Accueil',
                        message: 'coucou',
                        lastName: req.session.user[0],
                        firstName: req.session.user[1]
                    })
                }
            }
        },
        {
            path: 'listen',
            method: 'get',
            requireAuth: false,
            controller: async (req, res, next) => {
                if (req.session.logged != 'on') {
                    res.redirect('/login')
                } else {
                    res.render('listen', {
                        title: 'listen',
                        message: 'coucou',
                        testedHotword: 'linto',
                        lastName: req.session.user[0],
                        firstName: req.session.user[1]
                    })
                }
            }
        },
        {
            path: 'samplevalidity',
            method: 'post',
            requireAuth: false,
            controller: [
                async (req, res, next) => {



                    console.log("isValid:", req.body.isValid);


                    /*if (!!req.body.lastName && !!req.body.firstName) {

                        try {
                            let getUser = req.body;
                            const firstName = getUser.firstName
                            const lastName = getUser.lastName
                            var cookieName = [

                                'nom=' + lastName,
                                'prenom=' + firstName

                            ];
                            res.setHeader('Set-Cookie', cookieOui);
                            //let getUser = await model.getUser(req.body.userInfo);

                            if (typeof (lastName) === "undefined") { // User not found

                            } else { // User found
                                req.session.logged = 'on'
                                req.session.user = [firstName, lastName]
                                console.log(req.session.user)
                                req.session.save((err) => {
                                    if (err) {
                                        res.json({
                                            "status": "error",
                                            "msg": "Error on saving session"
                                        })
                                    } else {

                                        console.log('Succes authentification')
                                        res.json({
                                            "status": "success",
                                            "msg": "valid"
                                        })
                                    }
                                })
                            }
                        } catch (error) {
                            debug(error)
                        }
                    } else {
                        res.status(200)
                        return res.json({
                            "status": "error",
                            "message": "bad request (no param found)"
                        })
                    }*/
                }
            ]
        },
        {
            path: 'checkLogin',
            method: 'post',
            requireAuth: false,
            controller: [
                async (req, res, next) => {
                    if (!!req.body.lastName && !!req.body.firstName) {

                        try {
                            let getUser = req.body;
                            const firstName = getUser.firstName
                            const lastName = getUser.lastName
                            var cookieOui = [

                                'nom=' + lastName,
                                'prenom=' + firstName

                            ];
                            res.setHeader('Set-Cookie', cookieOui);
                            //let getUser = await model.getUser(req.body.userInfo);

                            if (typeof (lastName) === "undefined") { // User not found

                            } else { // User found
                                req.session.logged = 'on'
                                req.session.user = [firstName, lastName]
                                console.log(req.session.user)
                                req.session.save((err) => {
                                    if (err) {
                                        res.json({
                                            "status": "error",
                                            "msg": "Error on saving session"
                                        })
                                    } else {

                                        console.log('Succes authentification')
                                        res.json({
                                            "status": "success",
                                            "msg": "valid"
                                        })
                                    }
                                })
                            }
                        } catch (error) {
                            debug(error)
                        }
                    } else {
                        res.status(200)
                        return res.json({
                            "status": "error",
                            "message": "bad request (no param found)"
                        })
                    }
                }
            ]
        }
    ]
}


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