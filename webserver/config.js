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

const debug = require('debug')('linto-admin:config')
const dotenv = require('dotenv')
const path = require('path');
const fs = require('fs')

function ifHas(element, defaultValue) {
    if (!element) return defaultValue
    return element
}

function configureDefaults() {
    try {
        dotenv.config()
        const envdefault = dotenv.parse(fs.readFileSync('.envdefault'))

        //Server properties
        process.env.HTTP_PORT = ifHas(process.env.HTTP_PORT, envdefault.HTTP_PORT)
        process.env.NODE_ENV = ifHas(process.env.NODE_ENV, envdefault.NODE_ENV)
        process.env.SESSION_SECRET = ifHas(process.env.SESSION_SECRET, envdefault.SESSION_SECRET)
        process.env.WAKEWORD = ifHas(process.env.WAKEWORD, envdefault.WAKEWORD)

    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()