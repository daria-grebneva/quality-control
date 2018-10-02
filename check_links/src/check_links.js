const express = require("express");
const cheerio = require('cheerio');
const rqp = require("request-promise");
const bodyParser = require("body-parser");
const urlLib = require('url');
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

ProcessLinks();
StartServer();

function StartServer() {
    app.listen(8080);
    console.log("Server started on http://localhost:8080");
}

function ProcessLinks() {
    app.post("/check_links", MainAction);
}

function MainAction(request, response) {
    let url = request.body.url;
    let start, stop;
    start = (new Date()).getTime();
    if (url != "") {
        let brokenLinks = [];

        getAllData(url)
            .then(async (links) => {
                brokenLinks = GetBrokenUrl(links, brokenLinks);

                stop = (new Date()).getTime();
                const time = (stop - start) / 1000;
                let info = {time: time, linksNumber: links.length, brokenLinksNumber: brokenLinks.length};

                const allData = {links, brokenLinks, info};
                response.send(JSON.stringify(allData));
            });
   }
}

function getAllData(requestUrl) {
    return new Promise(async resolve => {
        let links = [];
        let queue = [];

        while (true) {
            let linksArr = [];
            let linksWithState = [];
            await getRequest(requestUrl)
                .then(async (data) => {
                    GetLinksFromPage(data, linksArr, requestUrl);
                    linksArr = DeleteUnusedLinks(linksArr, requestUrl);
                    await GetLinksInfo(linksArr)
                        .then(data => linksWithState = data);
                    queue = AddToQueue(queue, linksWithState, links, requestUrl);
                    links = AddToLinks(queue, linksWithState, links);
                })
                .catch(console.log);
            if (queue.length === 0) {
                break;
            }
            requestUrl = queue[0];
            queue.shift();
        }
        resolve(links);
    })
}

function GetBrokenUrl(links, brokenLinks) {
    for (let i = 0; i < links.length; ++i)
    {
        let status = links[i].status;
        if (!IsNormalStatus(status))
        {
            brokenLinks.push(links[i]);
        }
    }

    return brokenLinks;
}

function FindInArr(links, elem) {
    for (let i = 0; i < links.length; ++i)
    {
        if (links[i].link == elem)
        {
            return true;
        }
    }
    return false;
}

function AddToQueue(queue, linksWithState, links, requestUrl) {
    for (let i = 0; i < linksWithState.length; ++i)
    {
        let currentLink = linksWithState[i].link;
        if ((!FindInArr(links, currentLink)) && (queue.indexOf(currentLink) == -1) && (currentLink != requestUrl))
        {
            queue.push(linksWithState[i].link);
        }
    }
    return queue;
}

function AddToLinks(queue, linksWithState, links) {
    for (let i = 0; i < linksWithState.length; ++i)
    {
        if (!FindInArr(links, linksWithState[i].link))
        {
            links.push(linksWithState[i]);
        }
    }
    return links;
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
    status = status + '';
    return (status[0] != 4 && status[0] != 5);
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