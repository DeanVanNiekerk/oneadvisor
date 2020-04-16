/*
  Incredibly simple Node.js and Express application server for serving static assets.
*/

const express = require("express");
const path = require("path");
const appInsights = require("applicationinsights");
const port = process.env.PORT || 8080;

//Uses the APPINSIGHTS_INSTRUMENTATIONKEY environment variable
appInsights.setup();

const app = express();

// serve static assets normally
//app.use("/dist", express.static(__dirname + "/dist", { immutable: true, maxAge: 2419200000 })); //2419200000ms = 4 weeks
app.use("/dist", express.static(__dirname + "/dist")); //2419200000ms = 4 weeks

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (_request, response) {
    response.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(port);
console.log("server started on port " + port);
