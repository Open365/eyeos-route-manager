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

var sinon = require('sinon'),
	assert = require('chai').assert,
	RouteManager = require('../eyeos-route-manager.js');

suite('RouteManager Suite:', function() {
	var sut, callback, endpoint, server;
	var req, res, next;
	var funcWrapper;
	var httpMethodsToTest = ['get', 'post'];
	var myContext;

	setup(function() {
		callback = 'func';
		endpoint = '/test';
		server = {
			'post': function (endpoint, cb) {
				cb(req, res, next);
			},
			'get': function (endpoint, cb) {
				cb(req, res, next);
			}
		};

		req = 'fakeReq';
		res = 'fakeRes';
		next = 'fakeNext';
		funcWrapper = {
			callback: function () {
			}
		};
		myContext = {
			fakeProperty: 'fakeValue'
		};

		sut = new RouteManager(server);
	});

	function returnFunctionToTestHttpMethods( method) {
		return function () {
			this.mock(server)
				.expects(method)
				.once()
				.withExactArgs(endpoint, sinon.match.func);
			sut.addRoute(method, endpoint, callback, this);
		}
	}

	httpMethodsToTest.forEach(function(method) {
		test('addRoute should call ' + method + ' on restify', sinon.test(returnFunctionToTestHttpMethods(method)));
	});

	test('addRoute should call the callback correctly', sinon.test(function () {
		var extraParam = 'fakeExtraParam';

		this.mock(funcWrapper)
			.expects('callback')
			.once()
			.withExactArgs(req, res, next, extraParam)

		sut.addRoute('post', endpoint, funcWrapper.callback, myContext, extraParam);
	}));

	test('addRoute should call the callback with the correct context', sinon.test(function() {
		var extraParam = 'fakeExtraParam';

		this.mock(funcWrapper)
			.expects('callback')
			.once()
			.on(myContext);

		sut.addRoute('post', endpoint, funcWrapper.callback, myContext, extraParam);
	}));
});
