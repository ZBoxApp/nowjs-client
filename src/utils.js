/**
 * Created by enahum on 3/1/16.
 */

var utils = {};

utils.serializeObject = function(obj) {
    var query = '';
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            query += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
        }
    }
    return query.slice(0, -1);
};

module.exports = utils;
