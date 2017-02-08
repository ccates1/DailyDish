var aync = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var config = require('./config.js');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var morgan = require('morgan');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');
/*
 |--------------------------------------------------------------------------
 | express/middleware
 |--------------------------------------------------------------------------
 */
var app = express();
app.set('port', process.env.PORT || 3198);
app.use(cors({
  origin: '*',
  withCredentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin' ]
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'web')));
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
/*
 |--------------------------------------------------------------------------
 | mongoose/MongoDB
 |--------------------------------------------------------------------------
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.url);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB.');
});
