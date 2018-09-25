var express = require("express");
var cheerio = require('cheerio');
var rqp = require("request-promise");

var app = express();

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

ProcessLinks();
StartServer();

function StartServer() {
    app.listen(8080);
    console.log("Server started on http://localhost:8080");
}

function ProcessLinks() {
    app.get("/check_links", function (request, response) {
        var url = request.query.url;

        if (url != "") {

            var linksArr = [];
            var mainURL = url;

            let getData = () => {
                return new Promise(function (resolve, reject) {
                    rqp(mainURL, function (err, resp, body) {
                        if (err) throw err;
                        $ = cheerio.load(body);
                        links = $('a');
                        $(links).each(function (i, link) {
                            var link = $(link).attr('href');
                            const url = require('url');
                            link = url.resolve(mainURL, link);
                            linksArr.push(link);
                        });
                        linksArr = DeleteSomeLinks(linksArr);
                        setTimeout(() => {
                            resolve(GetStatusCode(mainURL, linksArr, response));
                        }, 500);
                    });
                });
            };

            (async () => {
                let main = async () => {
                    linksArr = await getData();
                };
                await main();

            })();

        } else {
            response.send("Please provide us first name");
        }
    });
}

function DeleteSomeLinks(linksArr) {
    linksArr.forEach(function (link) {
        if (!isNormalLink(link)) {
            var i = linksArr.indexOf(link);
            linksArr.splice(i, 1);
        }
    });

    return linksArr;
}

function GetStatusCode(mainURL, linksArr, response) {

    var linkInfo = [];
    let getData = () => {
        return new Promise(function (resolve, reject) {
            rqp(mainURL, function (err, resp, body) {

                //Идет вторым
                linkInfo = GetLinkInfo(linksArr, response);

                //Идет первым
                response.write("<br /><br /><br />");
                GetBrokenURL(linkInfo, response);

                setTimeout(() => {
                    resolve(linkInfo);
                }, 10000);
            });
        });
    };

    (async () => {
        let main = async () => {
            linkInfo = await getData();
        };
        await main();
        response.end();
    })();

    return linkInfo;
}

function isNormalLink(link) {
    return ((link.indexOf('http') != -1) || (link.indexOf('https') != -1) || (link.indexOf('ftp') != -1));
}

function IsNormalStatus(status) {
    return (status.charAt(0) != 3 && status.charAt(0) != 4 && status.charAt(0) != 5);
}

function GetLinkInfo(linksArr, response) {
    var linkInfo = [];
    linksArr.forEach(function (link) {
        var protocol = link.split('://')[0];
        protocol = require(protocol);
        protocol.get(link, function (res) {
            response.write("<a href=" + link + ">" + link + "</a>" + "  " + res.statusCode + "<br />");
            var linkElem = {};
            linkElem.link = link;
            linkElem.status = res.statusCode;
            linkInfo.push(linkElem);
            console.log("1");
        }).on('error', function (e) {
            // console.error(e);
        });
        console.log("2" );
    });
    console.log("3" );

    return linkInfo;
}

function GetBrokenURL(linkInfo, response) {
    for (var element in linkInfo)
    {
        if (!IsNormalStatus(element))
        {
            response.write("<a href=" + element.link + ">" + element.link + "</a>" + "  " + element.status + "<br />");
        }
    }
}