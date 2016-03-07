/**
 * Created by enahum on 3/1/16.
 */
var utils = require('./utils');
var statusCode = require('./status_code');

var instance = null;

function Auth(uri, credentials) {
    this.apiUri = uri;
    this.client_id = credentials.client_id;
    this.client_secret = credentials.client_secret;
    this.teams = {};
}

var proto = Auth.prototype;

proto.execute = function(teamName, callback) {
    var self = this;
    var team = self.teams[teamName];
    var now = new Date();
    if (team && now.getTime() < team.expires) {
        return callback.call(self);
    }
    return self._auth(teamName, function(err) {
        if (err) {
            return callback.call(self, err);
        }

        return callback.call(self);
    });
};

proto.getToken = function(teamName) {
    return this.teams[teamName].token;
};

proto._auth = function(teamName, callback) {
    var self = this;
    var cb = null;
    var request = new XMLHttpRequest();

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    request.open('POST', self.apiUri + '/oauth/client_token', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.onload = function() {
        var err;
        var data = JSON.parse(request.responseText);
        var now = new Date();
        if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
            self.teams[teamName] = {
                token: data.access_token,
                expires: now.setTime(now.getTime() + data.expires_in)
            };

            if (cb) {
                return cb.call(null, null, data);
            }
        } else {
            err = {
                status: request.status,
                message: data.message
            };

            if (cb) {
                return cb.call(null, err);
            }
        }

        return data;
    };

    request.onerror = function() {
        var err = {
            status: statusCode.SERVER_ERROR,
            message: request.statusText
        };

        if (cb) {
            return cb.call(null, err);
        }

        return err;
    };

    request.send(utils.serializeObject({
        grant_type: 'client_credentials',
        client_id: self.client_id,
        client_secret: self.client_secret,
        team_name: teamName
    }));
};

module.exports = function(uri, credentials) {
    if (instance) {
        return instance;
    }

    if (!uri) {
        throw new Error('API uri must be set');
    } else if (!credentials.client_id) {
        throw new Error('options must include client_id');
    } else if (!credentials.client_secret) {
        throw new Error('options must include client_secret');
    }
    instance = new Auth(uri, credentials);
    return instance;
};
