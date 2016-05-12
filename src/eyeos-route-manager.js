/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var logger = require('eyeos-logger');

function RouteManager(server) {
	this.server = server;
}

RouteManager.prototype = {
	addRoute: function(method, endpoint, callback, context, extraparam) {
		var self = this;
		this.server[method](endpoint, function(req, res, next) {
			logger.debug('RouteManager: called method', method, 'to endpoint', endpoint);
			self._debugParams(endpoint, req);
			callback.call(context, req, res, next, extraparam);
		});
		return this;
	},

	_debugParams: function RouteManager_debugParams (endpoint, req) {
		var params = {};
		var i;
		var item;
		var matches = endpoint.match(/:\w+/g);
		if (!matches) {
			return;
		}
		for (i = 0; i < matches.length; i++) {
			item = matches[i].substr(1);
			if (req.params && item in req.params) {
				params[item] = req.params[item];
			}
		}

		if (Object.getOwnPropertyNames(params).length > 0) {
			logger.debug('RouteManager: params:', params);
		}
	}
};

module.exports = RouteManager;
