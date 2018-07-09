var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./app/routes/server.routes')
var app = express()
var https = require('https');
var fs = require('fs');

/*var options = {
	key: fs.readFileSync('./private.key'),
	cert: fs.readFileSync('./certificate.crt')
}*/

//console.log(__dirname);
app.set('views', path.join(__dirname,'/app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use('/',router)

app.listen(3000, function () {
	  console.log('Plot app listening on port 3000!')
	})
/*https.createServer(options, app).listen(443, function () {
    console.log('Https server listening on port ' + 443);
});*/
	
module.exports = app;
