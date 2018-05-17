var express = require('express')
var revision = require("../models/revision.js")
var fs = require('fs')

var adminArray = new Array()
var botArray = new Array()
var AnonNumber = new Array()
var BotNumber = new Array()
var AdminNumber = new Array()
var UserNumber = new Array()

// render main page with parameters
module.exports.renderMainPage = function(req,res){
    res.render("main.pug");
}

module.exports.MostRevisions = function(req,res,next){
	revision.MostRevisions(function(err,result){
        var MostRevisions = new Array();
		if (err != 0){
			MostRevisions = 'error';
		}
		else{
			for(i=0;i<result.length;i++) {
                MostRevisions.push(result[i]);
            }
            res.json(MostRevisions);
            next()
		}		
	})	
}
module.exports.LeastRevisions =function(req,res,next){
	revision.LeastRevisions(function(err,result){
        var LeastRevisions = new Array();
		if (err != 0){
			LeastRevisions = 'error';
		}
		else{
            for(i=0;i<result.length;i++) {
                LeastRevisions.push(result[i]);
            }
            res.json(LeastRevisions);
            next()
		}		
	})
}

module.exports.SmallestGroup = function(req,res,next){
	revision.SmallestGroup(function(err,result){
        var SmallestGroup = new Array();
		if (err != 0){
			SmallestGroup = 'error'
		}
		else{
			for (i=0;i<result.length;i++){
				SmallestGroup.push(result[i]);
			}
			res.json(SmallestGroup);
			next()
		}		
	})	
}
module.exports.LargestGroup = function(req,res,next){
	revision.LargestGroup(function(err,result){
        var LargestGroup = new Array();
		if (err != 0){
			LargestGroup = 'error'
		}
		else{
            for (i=0;i<result.length;i++){
                LargestGroup.push(result[i]);
            }
            res.json(LargestGroup);
            next()
		}		
	})
}

// longest/shortest history
module.exports.LongestHistory = function(req,res,next){
	revision.LongestHistory(function(err,result){
        var longHis = new Array();
		if (err != 0){
			longHis = 'error'
		}
		else{
            for (i=0;i<result.length;i++){
                longHis.push(result[i]);
            }
            res.json(longHis);
            next()
		}	
	})
}
module.exports.ShortestHistory = function(req,res,next){
	revision.ShortestHistory(function(err,result){
        var shortHis = new Array();
		if (err != 0){
			shortHis = 'error'
		}
		else{
            for (i=0;i<result.length;i++){
                shortHis.push(result[i]);
            }
            res.json(shortHis);
            next()
		}	
	})
}

// convert admin.txt/bot.txt content to array
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
        console.log(array.length)
    });
}
txtToArray(admins,adminArray);
txtToArray(bots,botArray);
// updateRevs revisions: adding usertype attribute
module.exports.addAdmin = function(req, res, next){
    revision.addUsertype(adminArray,'admin',next)
}

module.exports.addBot = function(req, res, next){
    revision.addUsertype(botArray,'bot',next)
}

// get number of anon, bot, admin and regular users
module.exports.getAnon = function(req,res,next){
	revision.getAnonNumber(function(err,result){
		if (err != 0){
			console.log('error')
		}
		else{
			AnonNumber.splice(0,AnonNumber.length);
			for (var i = 2001; i < 2018 ; i++){
				AnonNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
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
			for (var i = 2001; i < 2018 ; i++){
				BotNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
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
			for (var i = 2001; i < 2018 ; i++){
				AdminNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
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
			for (var i = 2001; i < 2018 ; i++){
				UserNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						UserNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			//convert data to google char format
			var chart = new Array()
			for (var year = 2001 ; year < 2018 ; year ++){
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


