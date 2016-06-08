/**
 * Created by Mithun.Das on 6/8/2016.
 */
var crypto = require('crypto');

exports.hashPwd = function(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}

exports.createSalt = function() {
    return crypto.randomBytes(128).toString('base64');
}