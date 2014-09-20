/**
 * Main application file
 */

'use strict';
var express   = require('express');
var mongoose  = require('mongoose');
var http      = require('http');
var socketio  = require('socket.io');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config    = require('./config/environment');
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app      = express();
var server   = http.createServer(app);
var sockets  = socketio(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});

require('./config/socketio')(sockets);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;