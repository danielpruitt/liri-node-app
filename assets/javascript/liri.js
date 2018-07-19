require('dotenv').config();

var needed = require("./liri.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

console.log(spotify);
console.log(client);