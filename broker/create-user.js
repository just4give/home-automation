/**
 * Created by appstacksoultions.com on 6/7/16.
 */

var User = require('./user');
var Crypto = require('./crypto');


//console.log(process.argv);

var username = process.argv[2];
var password = process.argv[3];
var clientId = process.argv[4];

/*if(clientId !== 'edison' && clientId !== 'mobile'){
    console.log("Client ID not allowed");
    process.exit(1);
}*/

var salt, hash;
salt = Crypto.createSalt();
hash = Crypto.hashPwd(salt, password);
console.log("hashed password:", hash);

var user = new User({
    username: username,
    password: hash,
    salt :salt,
    clientId: clientId
});

user.save(function(err){
    if (err) {
        console.log(err.message);
    }

    console.log('User created successfully!');
    process.exit(0);
})


