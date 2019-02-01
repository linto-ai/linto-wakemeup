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
const debug = require('debug')('wakemeup:webserver:routes');

const ifHasElse = (condition, ifHas, otherwise) => {
    return !condition ? otherwise() : ifHas();
}

class Route {
    constructor(webServer) {
        const routes = require('./routes.js')(webServer);
        for (let level in routes) {
            for (let path in routes[level]) {
                const route = routes[level][path];
                webServer.app[route.method](
                    `${level}${path}`,
                    ifHasElse(
                        Array.isArray(route.controller),
                        () => Object.values(route.controller),
                        () => route.controller
                    )
                )
            }
        }
    }
}

module.exports = webServer => new Route(webServer);

