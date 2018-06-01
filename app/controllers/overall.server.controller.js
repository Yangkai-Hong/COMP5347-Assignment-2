var revision = require("../models/revision.js")

var AnonNumber = new Array()
var BotNumber = new Array()
var AdminNumber = new Array()
var UserNumber = new Array()

module.exports.renderMainPage = function(req,res){
    res.render("main.pug");
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

//show revisions duration information
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


