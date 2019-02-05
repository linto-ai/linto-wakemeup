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

const debug = require('debug')('wakemeup:webserver')
const express = require('express')
const http = require('http');
const bodyParser = require("body-parser");
const path = require("path");
var session = require('express-session');

class WebServer {
    constructor() {
        this.app = express()
        this.app.set('view engine', 'pug');
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: false
        }))

        //Memory session for dev purpose
        this.session = session({
            resave: false,
            saveUninitialized: true,
            secret: 'hushhhhhhhhhhh',
            cookie: {
                secure: false,
                maxAge: 604800 // 7 days
            }
        })

        this.app.use(this.session)

        this.app.use("/", express.static("public"))
        //My application routes
        require('./routes')(this)

        //Fails
        this.app.use((req, res, next) => {
            res.status(404)
            res.end()
        })

        this.app.use((err, req, res, next) => {
            console.error(err)
            res.status(500)
            res.end()
        })

        //Starts express server
        this.httpServer = this.app.listen(process.env.HTTP_PORT, 'localhost', (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
        return this.init()
    }

    async init() {
        return this
    }
}
module.exports = new WebServer()