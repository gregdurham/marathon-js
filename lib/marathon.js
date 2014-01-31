var util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    constants = require('./constants');

var MarathonBase = function(uri, timeout) {

    this.uri = uri || constants.uri;

    this.timeout = timeout || constants.timeout;

    this.headers = {
        'User-Agent': constants.userAgent
    };

    this.request = request.defaults({
        timeout: this.timeout,
        jar: false
    });
};

MarathonBase.prototype.callApi = function(path, data, method, cb) {
    method = method || 'GET';

    if (!_.isFunction(cb)) {
        cb = function() {};
    }

    if (_.isFunction(data)) {
        cb = data;
        data = {};
    }

    if (_.isFunction(method)) {
        cb = method;
        method = 'GET';
    }

    var options = {
        uri: this.uri + path,
        method: method
    };

    if (method === 'GET') {
        options['qs'] = data;
    } else if (method === 'POST' || method === 'PUT') {
        options['json'] = data;
        this.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    options['pool'] = {
        maxSockets: this.maxSockets
    };

    this.request(options, function(err, resp, body) {
        if (err) {
            cb(err);
        } else {
            if (resp.statusCode > 299) {
                cb(new Error(body.message));
            } else {
                cb(null, data);
            }
        }
    });
};

var MarathonAPIClient = function(uri, timeout) {
    MarathonAPIClient.super_.call(this, uri, timeout);
};
util.inherits(MarathonAPIClient, MarathonBase);

MarathonAPIClient.prototype.createApp = function(apps, cb) {
    this.callApi(constants.endPoints.start_apps, apps, 'POST', cb);
};

MarathonAPIClient.prototype.getApps = function(cb) {
    this.callApi(constants.endPoints.apps, cb);
};

MarathonAPIClient.prototype.getTasks = function(app, cb) {
    this.callApi(util.format(constants.endPoints.channelConfig, channel), cb);
};

MarathonAPIClient.prototype.ping = function(cb) {
    this.callApi(constants.endPoints.ping, cb);
};

exports.MarathonAPIClient = MarathonAPIClient;