require('dotenv').config();


var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var inquirer = require("inquirer")
var request = require("request");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//functions
function tweets() {
    var params = { screen_name: 'Daniel60192083', count: 20 };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            // console.log(response.statuses);
            for (var i = 0; i < 20; i++) {
                console.log("\n============================");
                console.log("Tweet: " + tweets[i].text);
                console.log("Tweeted at: " + tweets[i].created_at);
                console.log("============================\n");
            }
        }
    })
};

function songs() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song would you like me to get?",
            name: "song"
        }

    ]).then(function (getSongs) {
        var searched = getSongs.song;
        console.log("searching...  " + searched)
        if (searched === "") {
            console.log("================================");
            console.log("I'm sorry, it appears you didn't search a song. Here's my favorite.");
            console.log("Artist: The Sign");
            console.log("Album: Ace of Base");
            console.log("Link: https://open.spotify.com/track/3oCJJksC12uFxkt3RQ7rbV");
        }
        else {
            fs.appendFile("log.txt", " The song " + getSongs.song + " was added," ,function(err){
                if (err) {
                    console.log(err);
                }
                else{
                    console.log("Content Added!");
                }
            });
            spotify.search({ type: "track", query: "'" + searched + "'" }, function (error, data) {
                console.log("================================");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Link: " + data.tracks.items[0].external_urls.spotify);
            });
        }
    })

};

function movies() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie do you want to know about?",
            name: "movie"
        }
    ]).then(function (getMovie) {

        var searchedMovie = getMovie.movie;
        console.log(searchedMovie +" searched")
        var queryURL = "https://www.omdbapi.com/?apikey=trilogy&t=" + searchedMovie + "&type=movie";
        if (searchedMovie ==="") {
            var nobody = "https://www.omdbapi.com/?t=Mr.Nobody&apikey=93a934dc"
            request(nobody, function (error, response, body) {
                body = JSON.parse(body);
                console.log("=============================")
                console.log("OK...Here's what you need to know about your movie.")
                console.log("Title: " + body.Title);
                console.log("Year: " + body.Year);
                console.log("IMDB Rating: " + body.Ratings[0].Value);
                console.log("Rotten Tomatoes: " + body.Ratings[1].Value);
                console.log("Release Country: " + body.Country);
                console.log("Release Language: " + body.Language);
                console.log("Plot: " + body.Plot)
                console.log("Cast: " + body.Actors);
            })
        } else
        request(queryURL, function (error, response, body) {
            fs.appendFile("log.txt", " The Movie " + getMovie.movie + " was added," ,function(err){
                if (err) {
                    console.log(err);
                }
                else{
                    console.log("Content Added!");
                }
            });
            body = JSON.parse(body);
            console.log("=============================")
            console.log("OK...Here's what you need to know about your movie.")
            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("IMDB Rating: " + body.Ratings[0].Value);
            console.log("Rotten Tomatoes: " + body.Ratings[1].Value);
            console.log("Release Country: " + body.Country);
            console.log("Release Language: " + body.Language);
            console.log("Plot: " + body.Plot)
            console.log("Cast: " + body.Actors);
        });
    });
};


function random() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        spotify.search({ type: "track", query: "'" + data + "'" }, function (error, data) {
            console.log("================================");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        });
    });
};




//liri launches by asking you what you would like to do
inquirer.prompt([
    {
        type: "list",
        message: "Welcome to Liri. Please make a selection.",
        choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says"],
        name: "choice"
    }
]).then(function (inquirerResponse) {
    if (inquirerResponse.choice == "My Tweets") {
        console.log("================================");
        console.log("Twitter")
        tweets();
    }
    else if (inquirerResponse.choice == "Spotify This Song") {
        console.log("================================");
        console.log("Spotify")
        songs();
    }
    else if (inquirerResponse.choice == "Movie This") {
        console.log("================================");
        console.log("Movies")
        movies();
    }
    else if (inquirerResponse.choice == "Do What It Says") {
        console.log("================================");
        console.log("You did what it says");
        random();
    }

});
