/*
  Incredibly simple Node.js and Express application server for serving static assets.
*/

const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

// serve static assets
app.use(express.static("dist"));

app.listen(port);
console.log("server started on port " + port);
