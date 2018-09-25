const express = require("express");
const cheerio = require('cheerio');
const rqp = require("request-promise");
const urlLib = require('url');
const app = express();

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
    app.get("/check_links", MainAction);
}

function MainAction(request) {
    let url = request.query.url;
    if (url != "") {
        let linksArr = [];
        let mainURL = url;

        getRequest(mainURL).then(async (data) => {
            GetLinksFromPage(data, linksArr, mainURL);
            linksArr = DeleteUnusedLinks(linksArr, mainURL);
            let linksWithState = [];
            await GetLinksInfo(linksArr)
                .then(data => linksWithState = data);
            console.log(linksWithState);
        });
    }
}

function GetLinksFromPage(data, linksArr, mainURL) {
    $ = cheerio.load(data.body);
    links = $('a');
    $(links).each(function (i, link) {
        linksArr.push(urlLib.resolve(mainURL, $(link).attr('href')));
    });
}

function DeleteUnusedLinks(linksArr, mainURL) {
    linksArr.forEach(function (link) {
        if (!isNormalLink(link) || isThisDomain(link, mainURL)) {
            let i = linksArr.indexOf(link);
            linksArr.splice(i, 1);
        }
    });

    return linksArr;
}

function isThisDomain(link, mainURL) {
    const myURL = urlLib.parse(mainURL);
    const hostname = myURL.hostname;
    return (link.indexOf(hostname) == -1);
}


function getRequest(currentUrl) {
    return new Promise(resolve => {
        let options = {
            method: 'GET',
            uri: currentUrl,
            resolveWithFullResponse: true,
            simple: false
        };

        rqp(options)
            .then(resolve);
    })
}

function isNormalLink(link) {
    return ((link.indexOf('http') != -1) || (link.indexOf('https') != -1) || (link.indexOf('ftp') != -1));
}

function IsNormalStatus(status) {
    return (status.charAt(0) != 3 && status.charAt(0) != 4 && status.charAt(0) != 5);
}

function GetLinksInfo(linksArr) {
    return new Promise(async resolve => {
        let linkInfo = [];
        for (let i = 0; i < linksArr.length; ++i) {
            await getRequest(linksArr[i])
                .then((data) => {
                    let linkElem = {};
                    linkElem.link = linksArr[i];
                    linkElem.status = data.statusCode;
                    linkInfo.push(linkElem);
                });
        }

        resolve(linkInfo);
    })
}