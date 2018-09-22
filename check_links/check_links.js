var express = require("express");

//use the application off of express.
var app = express();

//define the route for "/"
app.get("/", function (request, response){
    response.sendFile(__dirname+"/index.html");
});

app.get("/getemail", function (request, response){
    var firstname = request.query.firstname;

    if (firstname != "") {
        //тут надо будет ссылки выводить
        var URL = firstname;
        var needle = require('needle');
        var cheerio = require('cheerio');

        // needle.get(URL, function(err, res){
        //     if (err) throw err;
        //     console.log(res.body);
        //     console.log(res.statusCode);
        // });
        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        needle(URL, function(err, resp, body){
            if (err) throw err;
            $ = cheerio.load(body);
            links = $('a'); //jquery get all hyperlinks
            $(links).each(function(i, link){
                var url = $(link).attr('href');
                // response.write();
                response.write(url);
                var https = require('https');

                try {
                    var request = https.get("google.com/", function(response) {
                        console.log(response.statusCode);
                    }).on("error", function(error) {
                        response.write(error.message);
                    });
                } catch(e) {
                    response.write(e);
                }
            });
        });
    } else {
        response.send("Please provide us first name");
    }
});

//start the server
app.listen(8080);

console.log("Something awesome to happen at http://localhost:8080");