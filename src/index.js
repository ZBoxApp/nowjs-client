/**
 * Created by enahum on 3/1/16.
 */
var auth = require('./auth');
var channels = require('./channels');
var messages = require('./messages');
var users = require('./users');

function resolve(url) {
    var resolver = document.createElement('a');
    resolver.href = url;
    return resolver.origin;
}

function Api() {
}

var proto = Api.prototype;

proto.initialize = function(opts) {
    if (!opts) {
        throw new Error('options need to be set');
    } else if (!opts.client_id) {
        throw new Error('options must include client_id');
    } else if (!opts.client_secret) {
        throw new Error('options must include client_secret');
    } else if (!opts.icon_url) {
        throw new Error('options must include icon_url');
    } else if (!opts.username) {
        throw new Error('options must include username');
    }

    this.apiUri = resolve(opts.url || 'https://zboxnow.com/');
    opts.url = this.apiUri;

    auth(this.apiUri, {client_id: opts.client_id, client_secret: opts.client_secret});

    this.channels = channels(this.apiUri);
    this.users = users(this.apiUri);
    this.messages = messages(opts);
};

window.zbox = (function() {
    'use strict';
    return new Api();
}());
