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
        response.send("Your email address is " + firstname + "@gullele.com");
    } else {
        response.send("Please provide us first name");
    }
});

//start the server
app.listen(8080);

console.log("Something awesome to happen at http://localhost:8080");