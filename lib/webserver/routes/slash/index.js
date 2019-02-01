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
const model = require(`${process.cwd()}/model`)

module.exports = (webServer) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: true,
        controller: [
            async (req, res, next) => {
                res.render('index', { title: 'WakeMeUp', message: 'Logged in, this is the evaluate / record selector' })
            }
        ]
    },
    {
        path: 'login',
        method: 'get',
        requireAuth: false,
        controller: async (req, res, next) => {
            res.render('index', { title: 'WakeMeUp', message: 'Please, login' })
        }
    },
    {
        path: 'login',
        method: 'post',
        requireAuth: false,
        controller: [
            async (req, res, next) => {
                if (!!req.body.userInfo) { // get post datas
                    try {
                        let getUser = await model.getUser(req.body.userInfo.userName)
                        if (getUser.length > 0) {
                            user = getUser[0]
                        }
                        if (typeof (user) === "undefined") { // User not found

                        } else { // User found
                            req.session.logged = 'on'
                            req.session.user = req.body.userInfo.userName
                            req.session.save((err) => {
                                if (err) {
                                    res.json({
                                        "status": "error",
                                        "msg": "Error on saving session"
                                    })
                                } else {
                                    res.json({
                                        "status": "success",
                                        "msg": "valid"
                                    }) //Valid password
                                }
                            })
                        }
                    } catch (error) {
                        debug(error)
                    }
                } else {
                    res.status(400)
                    return res.json({
                        "status": "error",
                        "msg": "Invalid post"
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