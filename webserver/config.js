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
    
    //MongoDB
    process.env.BDD_TYPE = ifHas(process.env.BDD_TYPE, envdefault.BDD_TYPE)
    process.env.MONGODB_HOST = ifHas(process.env.MONGODB_HOST, envdefault.MONGODB_HOST)
    process.env.MONGODB_PORT = ifHas(process.env.MONGODB_PORT, envdefault.MONGODB_PORT)
    process.env.MONGODB_DBNAME = ifHas(process.env.MONGODB_DBNAME, envdefault.MONGODB_DBNAME)
    process.env.MONGODB_REQUIRE_LOGIN = ifHas(process.env.MONGODB_REQUIRE_LOGIN, envdefault.MONGODB_REQUIRE_LOGIN)
    process.env.MONGODB_USER = ifHas(process.env.MONGODB_USER, envdefault.MONGODB_USER)
    process.env.MOGODB_PSWD = ifHas(process.env.MOGODB_PSWD, envdefault.MOGODB_PSWD)

  } catch (e) {
    console.error(debug.namespace, e)
    process.exit(1)
  }
}
module.exports = configureDefaults()