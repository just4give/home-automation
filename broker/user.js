/**
 * Created by appstacksoultions.com on 6/7/16.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mosca');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    clientId: { type: String, required: true }
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;