var express = require('express')
var Mongodb = require("../models/Mongodb.js")
var fs = require('fs')


var names = new Array()
var flag = new Array()

var MostRevisions
var LeastRevisions
var LargestGroup
var SmallestGroup
var LongestHistory
var ShortestHistory

var AnonNumber = new Array()

var admin_txt = new Array()
var bot_txt = new Array()

var AdminNumber = new Array()
var BotNumber = new Array()
var UserNumber = new Array()

var input1 = fs.createReadStream('./public/admin.txt');
var input2 = fs.createReadStream('./public/bot.txt')
function readLines(input,array) {
	var remaining = '';
	input.on('data', function(data) {
	  remaining += data;
	  if (remaining.charAt(remaining.length-1) != '\n'){remaining+='\n'}
	  var index = remaining.indexOf('\n');
	  while (index > -1) {
	    var line = remaining.substring(0, index);
	    remaining = remaining.substring(index + 1);
	    array.push(line);
	    index = remaining.indexOf('\n');
	  }
	  console.log(array.length)
	});
}

readLines(input1,admin_txt);
readLines(input2,bot_txt);

//function contains(arr,obj){
//	var i = arr.length;
//	while(i--){
//		if(arr[i]==obj){return true}
//	}
//	return false
//}

module.exports.add_admin = function(req,res,next){
	Mongodb.add_data(admin_txt,'admin',next)
}

module.exports.add_bot = function(req,res,next){
	Mongodb.add_data(bot_txt,'bot',next)
}


module.exports.getName = function(req,res,next){
	Mongodb.getName(function(err,result){
		if (err != 0){console.log('error')}
		else{
			names = names.concat(result)
			next()
		}
	})
}

module.exports.MostRevisions = function(req,res,next){
	Mongodb.MostRevisions(function(err,result){
		if (err != 0){MostRevision = 'error'}
		else{
			MostRevisions = result
			next()
		}		
	})	
}

module.exports.LeastRevisions =function(req,res,next){
	Mongodb.LeastRevisions(function(err,result){
		if (err != 0){LeastRevision = 'error'}
		else{
			LeastRevisions = result
			next()
		}		
	})
}

module.exports.SmallestGroup = function(req,res,next){
	Mongodb.SmallestGroup(function(err,result){
		if (err != 0){SmallestGroup = 'error'}
		else{
			SmallestGroup = result
			next()
		}		
	})	
}

module.exports.LargestGroup = function(req,res,next){
	Mongodb.LargestGroup(function(err,result){
		if (err != 0){LargestGroup = 'error'}
		else{
			LargestGroup = result
			next()
		}		
	})
}

module.exports.LongestHistory = function(req,res,next){
	Mongodb.LongestHistory(function(err,result){
		if (err != 0){LongestHistory = 'error'}
		else{
			LongestHistory = result
			next()
		}	
	})
}

module.exports.ShortestHistory = function(req,res,next){
	Mongodb.ShortestHistory(function(err,result){
		if (err != 0){ShortestHistory = 'error'}
		else{
			ShortestHistory = result
			res.render("entry.pug",{names:names,M_R:MostRevisions,S_R:LeastRevisions,L_G:LargestGroup,S_G:SmallestGroup,L_H:LongestHistory,S_H:ShortestHistory});
		}	
	})
}



module.exports.getAnon = function(req,res,next){
	Mongodb.getAnonNumber(function(err,result){
		if (err != 0){console.log('error')}
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
	Mongodb.getBotNumber(function(err,result){
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
	Mongodb.getAdminNumber(function(err,result){
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
	Mongodb.getUserNumber(function(err,result){
		if (err != 0){console.log('error')}
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
			chart.push(['Year','Administrator','Anonymous','Bot','Regular user'])
			for (var year = 2001 ; year < 2018 ; year ++){
				chart.push([year.toString(),AdminNumber[year-2001]['numOfEdits'],AnonNumber[year-2001]['numOfEdits'],BotNumber[year-2001]['numOfEdits'],UserNumber[year-2001]['numOfEdits']])
			}
			console.log('user')
			res.json({result:chart})			
		}				
	})		
}


