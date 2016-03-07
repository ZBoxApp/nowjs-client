/**
 * Created by enahum on 3/1/16.
 */
var auth = require('./auth');
var statusCode = require('./status_code');

var instance = null;

function Users(uri) {
    this.apiUri = uri;
    this.auth = auth();
}

var proto = Users.prototype;

proto.getAll = function(teamName, callback) {
    var self = this;
    var cb = null;

    var exec = function(error) {
        var request = new XMLHttpRequest();

        if (error) {
            if (cb) {
                return cb.call(null, error);
            }

            return error;
        }

        request.open('GET', self.apiUri + '/api/v1/users/profiles', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Bearer:' + self.auth.getToken(teamName));
        request.setRequestHeader('Accept', 'application/json');

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

        request.onload = function() {
            var err;
            var users;
            var data = JSON.parse(request.responseText);

            if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
                users = Object.keys(data).map(function(key) {
                    var user = data[key];
                    return {
                        id: key,
                        username: user.username,
                        email: user.email,
                        nickname: user.nickname,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        locale: user.locale,
                        roles: user.roles
                    };
                }).
                filter(function(user) {
                    var roles = user.roles;
                    delete user.roles;
                    return (user.username !== 'systembot' && roles !== 'guest');
                });

                if (cb) {
                    return cb.call(null, null, users);
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

        return request.send();
    };

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    self.auth.execute(teamName, exec);
};

proto.getStatuses = function(teamName, usersIds, callback) {
    var self = this;
    var cb = null;

    var exec = function(error) {
        var request = new XMLHttpRequest();

        if (error) {
            if (cb) {
                return cb.call(null, error);
            }

            return error;
        }

        request.open('POST', self.apiUri + '/api/v1/users/status', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Bearer:' + self.auth.getToken(teamName));
        request.setRequestHeader('Accept', 'application/json');

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

        request.onload = function() {
            var err;
            var data = JSON.parse(request.responseText);

            if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
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

        return request.send(JSON.stringify(usersIds));
    };

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    if (!Array.isArray(usersIds)) {
        var arrError = {
            status: statusCode.BAD_REQUEST,
            message: 'usersIds must be an array'
        };
        return cb.call(null, arrError);
    }

    return self.auth.execute(teamName, exec);
};

module.exports = function(uri) {
    if (instance) {
        return instance;
    }

    if (!uri) {
        throw new Error('API uri must be set');
    }

    instance = new Users(uri);
    return instance;
};
