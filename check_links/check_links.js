var express = require("express");
var app = express();


app.get("/", function (request, response){
    response.sendFile(__dirname+"/index.html");
});

app.get("/check_links", function (request, response){
    var url = request.query.url;

    if (url != "") {
        //тут надо будет ссылки выводить
        var URL = url;
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
            links = $('a');
            $(links).each(function(i, link){
                var link = $(link).attr('href');
                // response.write();
                link = qualifyURL(link);
                response.write(link + '\n');


                // var https = require('https');

                // try {
                //     var request = https.get("google.com/", function(response) {
                //         console.log(response.statusCode);
                //     }).on("error", function(error) {
                //         response.write(error.message);
                //     });
                // } catch(e) {
                //     response.write(e);
                // }
            });

            response.end();

        });
    } else {
        response.send("Please provide us first name");
    }
});

//start the server
app.listen(8080);

console.log("Something awesome to happen at http://localhost:8080");

function escapeHTML(s) {
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
}
function qualifyURL(url) {
    var el=  window.document.createElement('div');
    el.innerHTML= '<a href="'+escapeHTML(url)+'">x</a>';
    return el.firstChild.href;
}
//
// function ProcessLink(link, url)
// {
//     const PROTOCOLS = ['ftp', 'http', 'https'];
//     var isProtocol = false;
//     $(PROTOCOLS).each(function(i, protocol) {
//         var protocolPosition = link.search(protocol);
//         if (protocolPosition != -1)
//         {
//             isProtocol = true;
//         }
//     });
//
//     if (!isProtocol)
//     {
//         if (link.charAt(0) == '/')
//         {
//             link = link.slice(1);
//         }
//         link = url + link;
//     }
//
//     return link;
// }