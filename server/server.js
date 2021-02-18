
const devServerEnabled = true;

// needed to read certificates from disk
const fs          = require("fs");
const express = require("express");
var app     = express();

const path = require("path");

const webpack = require("webpack");
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const bodyParser = require("body-parser");


// Servers with and without SSL
const http        = require( "http"  )
const https       = require( "https" );
const httpPort    = 3333;
const httpsPort   = 3334;
const httpServer  = http.createServer(app);
const httpsServer = https.createServer({
    "key" : fs.readFileSync( './selfsigned.key' , "utf-8" ),
    "cert": fs.readFileSync( './selfsigned.crt', "utf-8" )
},app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (devServerEnabled) {

    config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
    
    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    }));

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));

  }

app.get('/*', function(req, res, next) {

  res.sendFile(path.join(__dirname, "../client_public/index.html"), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

httpServer.listen( httpPort, function() {
  console.log(  `Listening HTTP on ${httpPort}` );
});
httpsServer.listen( httpsPort, function() {
  console.log(  `Listening HTTPS on ${httpsPort}` );
});