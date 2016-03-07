/**
 * Created by enahum on 3/2/16.
 */
var auth = require('./auth');
var statusCode = require('./status_code');

var MAX_LENGTH = 4000;
var instance = null;

function Messages(opts) {
    this.apiUri = opts.url;
    this.iconUrl = opts.icon_url;
    this.username = opts.username;
    this.auth = auth();
}

var proto = Messages.prototype;

proto.prepare = function(message) {
    var self = this;
    return {
        text: message,
        username: self.username,
        icon_url: self.iconUrl
    };
};

proto.send = function(token, channelName, message, callback) {
    var self = this;
    var channel = channelName || 'town-square';
    var request = new XMLHttpRequest();
    var payload;
    var cb;

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    if (!message) {
        if (cb) {
            cb.call(null, {status: statusCode.BAD_REQUEST, message: 'No text specified'});
        }
        return;
    } else if (message.length > MAX_LENGTH) {
        if (cb) {
            cb.call(null, {status: statusCode.BAD_REQUEST, message: 'Message cannot be longer than ' + MAX_LENGTH + ' characters'});
        }
        return;
    }

    payload = {
        text: message,
        channel: channel,
        username: self.username,
        icon_url: self.iconUrl
    };

    request.open('POST', self.apiUri + '/hooks/' + token, true);
    request.setRequestHeader('Content-Type', 'application/json');

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
        var data = request.responseText;

        if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
            if (cb) {
                return cb.call(null, null);
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

    request.send(JSON.stringify(payload));
};

proto.sendEphemeral = function(token, channelName, userId, message, callback) {
    var self = this;
    var channel = channelName || 'town-square';
    var request = new XMLHttpRequest();
    var payload;
    var cb;

    if (callback && typeof callback === 'function') {
        cb = callback;
    }

    if (!message) {
        if (cb) {
            cb.call(null, {status: statusCode.BAD_REQUEST, message: 'No text specified'});
        }
        return;
    } else if (message.length > MAX_LENGTH) {
        if (cb) {
            cb.call(null, {status: statusCode.BAD_REQUEST, message: 'Message cannot be longer than ' + MAX_LENGTH + ' characters'});
        }
        return;
    }

    payload = {
        text: message,
        channel: channel,
        username: self.username,
        icon_url: self.iconUrl
    };

    request.open('POST', self.apiUri + '/ephemeral/' + token + '/' + userId, true);
    request.setRequestHeader('Content-Type', 'application/json');

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
        var data = request.responseText;

        if (request.status === statusCode.OK || request.status === statusCode.NOT_MODIFIED) {
            if (cb) {
                return cb.call(null, null);
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

    request.send(JSON.stringify(payload));
};

module.exports = function(opts) {
    if (instance) {
        return instance;
    }

    if (!opts) {
        throw new Error('options need to be set');
    } else if (!opts.url) {
        throw new Error('options url must be set');
    } else if (!opts.icon_url) {
        throw new Error('options must include icon_url');
    } else if (!opts.username) {
        throw new Error('options must include username');
    }

    instance = new Messages(opts);
    return instance;
};
