var express = require('express')
var mongoose = require('mongoose')
var request = require('request')

var revSchema = new mongoose.Schema(
		{
            revid:Number,
            parentid:Number,
            user:String,
            timestamp:String,
            size:Number,
			sha1: String,
			parsedcomment:String,
            title: String,
			anon:String,
			usertype:String
		},
		{
		    versionKey: false 
		});
var Revision = mongoose.model('Revision', revSchema, 'revisions')

mongoose.connect('mongodb://localhost/wikipedia',function () {
	  console.log('mongodb connected')
});

//update bot & admin
module.exports.add_data = function (array,usertype, next){
	Revision.update({user:{"$in":array}},{$set:{"usertype":usertype}},{'multi':true},function(err){
		if(err){console.log('add_error')}
		else{
			next()
		}
	});
}

//update database
module.exports.update_data = function (title,callback){
	console.log(title);
	var update_array = new Array();
	url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=sha1%7Ctimestamp%7Cparsedcomment%7Cids%7Cuser%7Cflags%7Csize&format=json&rvlimit=max&titles=';
	url += title;
	request({
		url:url,
		method:"POST",
		json:true,
		headers: { 'Api-User-Agent': 'Example/1.0' },	
	},function(error,response,body){
		if (error){callback(1)}
		var info = body['query']['pages']
		 for (var key in info){
			 R_info = info[key]
		 }
		title = R_info['title']
		revisions = R_info['revisions']
		for (var item in revisions)
			revisions[item]['title'] = title
		
//		console.log(revisions[0])
			
		var selected_timestamp;
		Revision.find({title:title})
		.sort({'timestamp':-1})
		.limit(1)
		.exec(function(err,result){
			if (err){
				console.log("Query error!")
			}else{
			selected_timestamp = result[0]['timestamp']
			}
			console.log(selected_timestamp)
			for (var item in revisions){
				if (revisions[item]['timestamp'] > selected_timestamp){
//					console.log(revisions[item]['timestamp'])
//					insert the data here
					var insert = (revisions[item])
					
					Revision.create(insert,function(err,docs){
						if(err) console.log(err);
						console.log("success");
					});
					update_array.push(revisions[item])
				}
			}
			callback(0,update_array)
		});	
	});

}

//Get Distinct Name
module.exports.getName = function (callback){	
	Revision.distinct('title')
	.exec(function(err,result){
		if(err){
			console.log("Query error!");
			callback(1)
		}
		else{
			callback(0,result)
		}
	})
}

//Get article title with most/least revisions
module.exports.MostRevisions = function (callback){
	var MostNumberRevisions = [
		{'$group':{'_id':"$title", 'numOfEdits': {$sum:1}}},
		{'$sort':{numOfEdits:-1}},
		{'$limit':1}	
	]
	Revision.aggregate(MostNumberRevisions, function(err, results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}
	})
}

module.exports.LeastRevisions = function(callback){
	var LeastNumberRevisions = [
		{'$group':{'_id':"$title", 'numOfEdits': {$sum:1}}},
		{'$sort':{numOfEdits:1}},
		{'$limit':1}	
	]	
	Revision.aggregate(LeastNumberRevisions, function(err, results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}
	})
}

//Get article title with largest/smallest group
module.exports.LargestGroup = function(callback){
	var LargestGroup = [
		{'$match':{$and:[ {anon:{$ne:""}},{'usertype':{'$exists':false}}] }},
        {$group:{_id:{user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title",count:{$sum:1}}},
        {'$sort':{count:-1}},
        {'$limit':1}
	]	
	Revision.aggregate(LargestGroup,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}		
	})
}


module.exports.SmallestGroup = function (callback){	
	var SmallestGroup = [
		{'$match':{$and:[ {anon:{$ne:""}},{'usertype':{'$exists':false}}] }},
        {$group:{_id:{user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title",count:{$sum:1}}},
        {'$sort':{count:1}},
        {'$limit':1}		
	]	
		
	Revision.aggregate(SmallestGroup,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}		
	})
}

//Get article title with longest/shortest hostory
module.exports.LongestHistory = function(callback){
	var LongestHistory = [
		{'$group':{'_id':'$title','timestamp':{$min:'$timestamp'}}},
		{'$sort':{timestamp:1}},
		{'$limit':1}
	]
	Revision.aggregate(LongestHistory,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}		
	})	
}

module.exports.ShortestHistory = function(callback){
	var ShortestHistory = [
		{'$group':{'_id':'$title','timestamp':{$min:'$timestamp'}}},
		{'$sort':{timestamp:-1}},
		{'$limit':1}
	]
	Revision.aggregate(ShortestHistory,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results[0]['_id'])
		}		
	})	
}

//Get number of anon users
module.exports.getAnonNumber = function(callback){
	var AnonNumber = [
		{'$match':{anon:""}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}
	]
	Revision.aggregate(AnonNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

module.exports.getBotNumber = function(callback){
	var BotNumber = [
		{'$match':{usertype:"bot"}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(BotNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

module.exports.getAdminNumber = function(callback){
	var AdminNumber = [
		{'$match':{usertype:"admin"}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(AdminNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
}

module.exports.getUserNumber = function(callback){
	var UserNumber = [
		{'$match':{$and:[ {anon:{$ne:""}},{'usertype':{'$exists':false}}] }},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(UserNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
}

//Get number of revisions for an article
module.exports.getTotalNumber = function(title,callback){
	Revision.find({'title':title})
	.count()
	.exec(function(err,result){
		if (err){
			console.log("Query error!")
			callback(1)
		}else{
			callback(0,result)
		}
	})
}


//Get number of anon users for an article
module.exports.getArticleAnonNumber = function(title,callback){
	var AnonNumber = [
		{'$match':{anon:"",title:title}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}
	]
	Revision.aggregate(AnonNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

module.exports.getArticleBotNumber = function(title,callback){
	var BotNumber = [
		{'$match':{usertype:"bot",title:title}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(BotNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

module.exports.getArticleAdminNumber = function(title,callback){
	var AdminNumber = [
		{'$match':{usertype:"admin",title:title}},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(AdminNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
}

module.exports.getArticleUserNumber = function(title,callback){
	var UserNumber = [
		{'$match':{$and:[ {anon:{$ne:""}},{'usertype':{'$exists':false}},{title:title}] }},
		{'$group':{'_id':{"$substr":["$timestamp",0,4]},'numOfEdits':{$sum:1}}},
		{'$sort':{_id:1}}			
	]
	Revision.aggregate(UserNumber,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
}




////Get number of registered users for an article
//module.exports.getArticleRegisterNumber = function(title,callback){
//	var RegisteredNumber = [
//		{'$match':{anon:{$ne:""},title:title}},
//		{$group:{'_id':{year:{"$substr":["$timestamp",0,4]},user:"$user"},'numOfEdits':{$sum:1}}}	
//	]
//	Revision.aggregate(RegisteredNumber,function(err,results){
//		if (err){
//			console.log("Aggregation Error")
//			callback(1)
//		}else{
//			callback(0,results)
//		}		
//	})	
//	
//}

//Get top 5 registered users for an article
module.exports.getTop5 = function(title,callback){
	var top5 = [
		{'$match':{$and:[ {anon:{$ne:""}},{'usertype':{'$exists':false}},{title:title}] }},
		{$group:{_id:"$user",numOfEdits:{$sum:1}}},
		{$sort:{numOfEdits:-1}},
		{$limit:5}
	]
	Revision.aggregate(top5,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})		
}

//Get top5 Revision numbers for each year for an article
module.exports.getYearlyTop5 = function(title,users,callback){
	var Yearlytop5 = [
		{'$match':{title:title,user:{"$in":users}}},
		{'$group':{_id:{year:{"$substr":["$timestamp",0,4]},user:'$user'},'numOfEdits':{$sum:1} }},
		{'$sort':{_id:1}}
		]
	Revision.aggregate(Yearlytop5,function(err,results){
		if (err){
			console.log("Aggregation Error")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
	
}

