/**
 * Created by appstacksoultions.com on 6/7/16.
 */
console.log(process.argv);

var username = process.argv[2];
var password = process.argv[3];
var clientId = process.argv[4];

if(clientId !== 'edison' && clientId !== 'mobile'){
    console.log("Client ID not allowed");
    process.exit(1);
}

console.log("Creating new user");