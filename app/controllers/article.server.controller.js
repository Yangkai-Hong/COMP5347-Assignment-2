var express = require('express')
var Mongodb = require("../models/revision.js")
var fs = require('fs')

var number

//var admin_txt = new Array()
//var bot_txt = new Array()
//var RegisteredNumber = new Array()

var top5 = new Array()
var AnonNumber = new Array()
var adminNumber = new Array()
var botNumber = new Array()
var userNumber = new Array()

module.exports.updateRevs = function(req, res){
	title = req.query.title
	Mongodb.updateRevisions(title,function(err, result){
		if (err != 0){
			res.json({'count':'error'})
		}else{
			//console.log(result)
			//for (var i in result){console.log(result[i]['timestamp'])}
			updatedNum = result.length
			res.json({'count':updatedNum})
		}
	})
}

module.exports.getRevNumTotal = function(req, res, next){
	title = req.query.title
	Mongodb.getRevNumTotal(title,function(err, result){
		if (err != 0){res.json({'count':'error'})}
		else{
			number = result
			console.log('Total')
			next()
		}
	})
}

module.exports.getTop5 = function(req,res,next){
	title = req.query.title
	Mongodb.getTop5(title,function(err,result){
		if (err != 0){console.log('error')}
		else{
			top5.splice(0,top5.length)
			for (var i in result){
				top5.push(result[i]['_id'])
			}
			console.log('Top5')
			next()
		}
	})
}

module.exports.getAnonNumByYear = function(req, res, next){
	title = req.query.title
	Mongodb.getAnonNumByYear(title,function(err, result){
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
			console.log('Anon')
			next()
		}		
	})
}
module.exports.getBotNumByYear = function(req, res, next){
	title = req.query.title
	Mongodb.getBotNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			botNumber.splice(0,botNumber.length);
			for (var i = 2001; i < 2018 ; i++){
				botNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						botNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			console.log('Bot')
			next()
		}				
	})	
}
module.exports.getAdminNumByYear = function(req, res, next){
	title = req.query.title
	Mongodb.getAdminNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			adminNumber.splice(0,adminNumber.length);
			for (var i = 2001; i < 2018 ; i++){
				adminNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						adminNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			console.log('Admin')
			next()
		}				
	})		
}
module.exports.getUserNumByYear = function(req, res, next){
	title = req.query.title	
	Mongodb.getUserNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			userNumber.splice(0,userNumber.length);
			for (var i = 2001; i < 2018 ; i++){
				userNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j < 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						userNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			
			//convert data to google char format
			var chart = new Array()
			chart.push(['Year','Administrator','Anonymous','Bot','Regular user'])
			for (var year = 2001 ; year < 2018 ; year ++){
				chart.push([year.toString(),adminNumber[year-2001]['numOfEdits'],AnonNumber[year-2001]['numOfEdits'],botNumber[year-2001]['numOfEdits'],userNumber[year-2001]['numOfEdits']])
			}
			console.log('User')
			res.json({Title:title,RevNum:number,top5:top5,result:chart})
		}				
	})
}

module.exports.getTop5Data = function(req,res){
	title = req.query.title
	users = req.query.users
//	console.log(title)
	Mongodb.getYearlyTop5(title,users,function(err,result){
		if (err != 0){console.log('error')}
		else{
			//convert data to google char format
			var chartData = new Array()
			var tmp = ['Year'].concat(users)
			chartData.push(tmp)
			
			for (var i = 2001; i < 2018 ; i++){
				var P = [i]
				for (var j = 0; j < users.length ; j++){
					P.push(0)
				}
				chartData.push(P)
			}
//			console.log(result)
			for (var i in result){
				for (var j in chartData[0]){
					if(result[i]['_id']['user'] == chartData[0][j]){
						year = parseInt(result[i]['_id']['year'])
						chartData[year-2001][j] += result[i]['numOfEdits']
					}
				}
			}
			
			for (var i = 2001; i < 2018 ; i++){
				chartData[i-2001][0] = chartData[i-2001][0].toString()
			}
//			console.log(chartData)
			
			res.json({result:chartData})
		}
	})	
}




