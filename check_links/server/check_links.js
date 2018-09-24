var express = require("express");
var cheerio = require('cheerio');
var needle = require('needle');
var window = require('window');
var $ = require('jQuery');

var app = express();

ProcessLinks();
StartServer();

function StartServer() {
    app.listen(8080);
    console.log("Something awesome to happen at http://localhost:8080");
}

function ProcessLinks() {
    app.get("/check_links", function (request, response) {
        var url = request.query.url;

        if (url != "") {

            var links = [];
            var mainURL = url;


            slovo = 'LALA';


            needle(mainURL, function(err, resp, body){
                if (err) throw err;
                $ = cheerio.load(body);
                links = $('a');
                $(links).each(function(i, link){
                    var link = $(link).attr('href');
                    const url = require('url');
                    link = url.resolve(mainURL, link);
                    // response.write(link + '\n');
                    //links.push(link);
                });
               slovo = 'poliuchilos';

            });

            var deferred = $.Deferred();
            setTimeout(function() { deferred.resolve(100); }, 5000);
            var promise = deferred.promise();
            promise.done(function(slovo)
            {
                console.log(slovo);
            });

            response.end();
        } else {
            response.send("Please provide us first name");
        }
    });
}


function GetAllLinks(mainURL) {
    links = [];
    needle(mainURL, function (err, resp, body) {
        if (err) throw err;
        $ = cheerio.load(body);
        href = $('a');
        $(href).each(function (i, link) {
            var link = $(link).attr('href');
            const url = require('url');
            link = url.resolve(mainURL, link);
            links.push(link);
        });
    });

    return links;
}