/**
 * Created by enahum on 3/1/16.
 */
var auth = require('./auth');
var statusCode = require('./status_code');

var instance = null;

function Channels(uri) {
    this.apiUri = uri;
    this.auth = auth();
}

var proto = Channels.prototype;

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

        request.open('GET', self.apiUri + '/api/v1/channels/all', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Bearer:' + self.auth.getToken(teamName));

        request.onload = function() {
            var err;
            var channels;
            var data = JSON.parse(request.responseText);

            if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
                channels = data.channels.map(function(c) {
                    return {
                        id: c.id,
                        type: c.type === 'O' ? 'channel' : 'group',
                        display_name: c.display_name,
                        name: c.name
                    };
                });

                if (cb) {
                    return cb.call(null, null, channels);
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

        return request.send();
    };

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    self.auth.execute(teamName, exec);
};

proto.getMembers = function(teamName, channelId, limit, callback) {
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

        var url = self.apiUri + '/api/v1/channels/' + channelId + '/members';
        if (limit && limit > 0) {
            url = url + '/' + limit.toString();
        }

        request.open('GET', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Bearer:' + self.auth.getToken(teamName));

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

        return request.send();
    };

    if (callback && typeof callback === 'function') {
        cb = callback;
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

    instance = new Channels(uri);
    return instance;
};
