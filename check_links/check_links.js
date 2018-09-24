var express = require("express");
var cheerio = require('cheerio');
var needle = require('needle');
var request = require('request');
var rqp = require("request-promise");

var app = express();

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

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

                //Приходит объект ссылка-статус, обработать плохие статусы
                // console.log(linksArr);
                // for (element in linksArr) {
                //     console.log( element.link +  "  " + element.statusCode );
                // };

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
                var linkInfo = [];
                linksArr.forEach(function (link) {
                    var protocol = link.split('://')[0];
                    protocol = require(protocol);

                    protocol.get(link, function (res) {
                       // response.write("<a href=" + link + ">" + link + "</a>" + "  " + res.statusCode + "<br />");
                        var linkElem = {};
                        linkElem.link = link;
                        linkElem.status = res.statusCode;
                        linkInfo.push(linkElem);
                    }).on('error', function (e) {
                        // console.error(e);
                    });
                });

                console.log(linkInfo);
                response.write("<br /><br /><br />");

                for (var element in linkInfo)
                {
                    response.write(element.link);
                    // if (!IsNormalStatus(element))
                    // {
                    //     response.write("<a href=" + element.link + ">" + element.link + "</a>" + "  " + element.status + "<br />");
                    // }
                }
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
    return (status.charAt(0) != 4 && status.charAt(0) != 5);
}

function GetLinkInfo() {

}