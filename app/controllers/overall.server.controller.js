var revision = require("../models/revision.js")
var fs = require('fs')

var AnonNumber = new Array()
var BotNumber = new Array()
var AdminNumber = new Array()
var UserNumber = new Array()

module.exports.renderMainPage = function(req,res,next){
    res.render("main.pug");
    next();
}

module.exports.mostRevisions = function(req,res,next) {
    var num = parseInt(req.query.num);
    //console.log(num);
    revision.MostRevisions(num, function (err, result) {
        if (err != 0) {
            console.log('error')
        }
        else {
			res.json(result);
        }
    })
}
module.exports.leastRevisions = function(req,res,next) {
    var num = parseInt(req.query.num);
    revision.LeastRevisions(num, function (err, result) {
        LeastRevisions = new Array();
        if (err != 0) {
            console.log('error')
        }
        else {
            res.json(result);
        }
    })
}
module.exports.largestGroup = function(req,res,next) {
    revision.LargestGroup(function (err, result) {
        LargestGroup = new Array();
        if (err != 0) {
            console.log('error')
        }
        else {
            res.json(result)
        }
    })
}
module.exports.smallestGroup = function(req,res,next) {
    revision.SmallestGroup(function (err, result) {
        SmallestGroup = new Array();
        if (err != 0) {
            console.log('error')
        }
        else {
            res.json(result)
        }
    })
}
module.exports.longestHistory = function(req,res,next) {
    revision.top3LongestHistory(function (err, result) {
        longHis = new Array();
        if (err != 0) {
            console.log('error')
        }
        else {
            res.json(result)
        }
    })
}
module.exports.shortestHistory = function(req,res,next){
    revision.ShortestHistory(function(err,result){
        shortHis = new Array();
        if (err != 0){
            console.log('error')
        }
        else{
            res.json(result)
        }
    })
	//next();
}

//show revisions duration information (facing dataset changes)
revision.getDuration(function (err,result) {
	if (err!=0){
		console.log('error')
	}
	else {
		var min = result[0];
		var max = result[result.length-1]
		console.log(min);
		console.log(max);
	}
});

// get number of anon, bot, admin and regular users
module.exports.getAnon = function(req,res,next){
	revision.getAnonNumber(function(err,result){
		if (err != 0){
			console.log('error')
		}
		else{
			AnonNumber.splice(0,AnonNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				AnonNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						AnonNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			console.log('anon')
			next()
		}
	})
}
module.exports.getBot = function(req,res,next){
	revision.getBotNumber(function(err,result){
		if (err != 0){console.log('error')}
		else{
			BotNumber.splice(0,BotNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				BotNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						BotNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			console.log('bot')
			next()
		}
	})
}
module.exports.getAdmin = function(req,res,next){
	revision.getAdminNumber(function(err,result){
		if (err != 0){console.log('error')}
		else{
			AdminNumber.splice(0,AdminNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				AdminNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						AdminNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			console.log('admin')
			next()
		}
	})
}
module.exports.getUser = function(req,res,next){
	revision.getUserNumber(function(err,result){
		if (err != 0){
			console.log('error')
		}
		else{
			UserNumber.splice(0,UserNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				UserNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						UserNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			//convert data to google char format
			var chart = new Array()
			for (var year = 2001 ; year <= 2018 ; year ++){
				chart.push({Year:year.toString(),
							Administrator:AdminNumber[year-2001]['numOfEdits'],
							Anonymous:AnonNumber[year-2001]['numOfEdits'],
							Bot:BotNumber[year-2001]['numOfEdits'],
							Regular_user:UserNumber[year-2001]['numOfEdits']})
			}
			console.log('user')
			res.json(chart)
		}
	})
}


// Add usertype attribute to revisions
// 1. convert admin.txt/bot.txt content to array
var adminArray = new Array()
var botArray = new Array()
var admins = fs.createReadStream('./public/admin.txt');
var bots = fs.createReadStream('./public/bot.txt')
function txtToArray(txt,array) {
    var remainingData = '';
    txt.on('data', function(data) {
        remainingData += data;
        if (remainingData.charAt(remainingData.length-1) != '\n'){
            remainingData+='\n'
        }
        //console.log(remainingData);
        var index = remainingData.indexOf('\n');
        //console.log(index);
        while (index > -1) {
            var line = remainingData.substring(0, index);
            // new remainingData = remainingData - line
            remainingData = remainingData.substring(index + 1);
            array.push(line);
            index = remainingData.indexOf('\n');
        }
        //console.log(array.length)
    });
}
txtToArray(bots,botArray);
txtToArray(admins,adminArray);

module.exports.addBot = function(req,res,next) {
    revision.addUserType(botArray, 'bot',function (err) {
		if (err!=0){
			console.log('error in addUserType overall controller')
		}
		else {
            console.log('add userType:bot to '+botArray.length +" bots")
		}
    });
    next();
}
module.exports.addAdmin = function(req,res,next) {
    revision.addUserType(adminArray, 'admin',function (err) {
		if (err!=0){
			console.log('error in addUserType overall controller')
		}
		else {
			console.log('add userType:admin to '+adminArray.length +" admins")
		}
    });
    next();
}


