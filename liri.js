require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs")

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);


// The 3rd argument which activates the switch statement
var command = process.argv[2];
//runs everything from the 4+ argument and turns it into a single string 
var nodeArgs = process.argv;
var input = "";
    for (var i=3; i<nodeArgs.length; i++){
        input = input + " " + nodeArgs[i];
    };
    console.log(input.trim());


switch (command){
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        //if there is an input use the input and call the spotify API
        if(input.trim()){
            music();
        //if there is no input, use x as input and call the spotify API 
        } else {
            input="The Sign";
            music();
        }
        break;
    case "movie-this":
        if(input.trim()){
            movie();
        } else {
            input="Mr. Nobody";
            movie();
        }
        break;
    case "do-what-it-says":
        doThis();
        break;
}

function tweets() {
    var params = {screen_name: 'tlo015', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i=0; i<tweets.length; i++) {
                console.log("Date: " + tweets[i].created_at.substr(0,10));
                console.log(tweets[i].text);
                console.log("\n");
            }
        } 
    });
};


function music() {
    // if(input === undefined) {
    //     input = "The Sign"
    // }
    spotify.search({type: 'track', query: input.trim()}, function(error, data) {
        if (error) {
            console.log (error);
            return;
        } else {
            var songName = data.tracks.items[0];
            console.log("Artist: " + songName.artists[0].name);
            console.log("Song Name: " + songName.name);
            console.log("Song Preview URL: " + songName.preview_url);
            console.log("Album: " + songName.album.name);
        }
    });      
}

function movie() {
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + input.trim() + "&y=&plot=short&apikey=trilogy";
        // This line is just to help us debug against the actual URL.
        console.log(queryUrl);

    request(queryUrl, function(error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
             // Parse the body of the site
            var json = JSON.parse(body);
            console.log("Title: " + json.Title);
            console.log("Year: " + json.Year);
            console.log("IMDB Rating: " + json.imdbRating);
            console.log("Rotten Tomatoes Rating: " + json.Ratings[1].Value);
            console.log("Produced Country: " + json.Country );
            console.log("Language: " + json.Language);
            console.log("Plot: " + json.Plot);
            console.log("Actors: " + json.Actors);            
        }
    });
}

function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
       
        if (error) {
            return console.log(error);
        } else {
            var dataArr = data.split(",");
                console.log (dataArr);
            command = dataArr[0];
            input = dataArr[1];
        }
    });
}