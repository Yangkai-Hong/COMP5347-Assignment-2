/**
 * The file to start a server
 *
 */

var express = require('express');
var path = require('path');
var request = require('request');
var mongoose = require('mongoose');
var router = require('./app/routes/Assignment2.server.routes')

var app = express()

app.set('views', path.join(__dirname,'/app/views'));
app.use(express.static(path.join(__dirname, 'public')));
	

app.use('/',router)

app.listen(3000, function () {
	  console.log('Plot app listening on port 3000!')
	})
	
module.exports = app;