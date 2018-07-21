require('dotenv').config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
// var fs = require("fs");
var inquirer = require("inquirer")
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//functions
function tweets(){
    var params = {screen_name:'Daniel60192083', count:20};
    client.get("statuses/user_timeline",params,function(error,tweets,response){
        if(!error &&response.statusCode===200){
            // console.log(response.statuses);
            for (var i = 0; i < 20; i++){
                console.log("\n============================");
                console.log("Tweet: " + tweets[i].text);
                console.log("Tweeted at: " + tweets[i].created_at);
                console.log("============================\n");
            }
        }
    })
};

function songs(){
    inquirer.prompt([
        {
        type: "input",
        message:"What song would you like me to get?",
        name:"song"
        }

    ]).then(function(getSongs){
        var searched = getSongs.song;
        console.log("searching...  " + searched)
        if (searched === ""){
            
            console.log("I'm sorry, it appears you didn't search a song. Here's my favorite.");
            console.log("Artist: The Sign" );
            console.log("Album: Ace of Base");
            console.log("Link: https://open.spotify.com/track/3oCJJksC12uFxkt3RQ7rbV");   
            }
        else {
            spotify.search({type:"track", query:"'" + searched + "'"}, function(error, data){
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Link: " + data.tracks.items[0].external_urls.spotify);
            }); 
        }
    })

}


//inquirers 
inquirer.prompt([
    {
        type:"list",
        message:"Welcome to Liri. Please make a selection.",
        choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says"],
        name: "choice"
    }
]).then (function (inquirerResponse){
    if (inquirerResponse.choice == "My Tweets"){
        console.log("Twitter")
        tweets();
    }
    else if (inquirerResponse.choice == "Spotify This Song"){
            console.log("Spotify")
            songs();
    }
    else if (inquirerResponse.choice == "Movie This"){
            console.log("Movies")
    }
    else if (inquirerResponse.choice == "Do What It Says"){
            console.log("Random")
    }

});


// remember to npm install request and try using request, refer to 20 and 21
// look to see if there needs to be npm install for APIs 
// look at inquirer, activity 25