// This is the default Glitch server.js to serve static things.

// init project
var express = require("express");
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
});

// listen for requests :)
var listener = app.listen(3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
