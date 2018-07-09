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

// index schemas
revSchema.index({user:1});
revSchema.index({timestamp:1});
revSchema.index({timestamp:-1});
revSchema.index({title:1});
revSchema.index({anon:-1});
revSchema.index({anon:1});
revSchema.index({usertype:1});
revSchema.index({usertype:-1});

var Revision = mongoose.model('Revision', revSchema, 'revisions')

/*var uri = "mongodb+srv://hyk:Srhongyangkai1994@yangkai-hong-mdsnm.mongodb.net/wikipedia";
mongoose.connect(uri,function () {
	  console.log('mongodb connected')
});*/
mongoose.connect('mongodb://localhost/wikipedia',function () {
    console.log('mongodb connected')
});

//updateRevs new revisions
module.exports.updateRevisions = function (title, callback){
	//console.log(title);
	var updateArray = new Array();
	url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=sha1%7Ctimestamp%7Cparsedcomment%7Cids%7Cuser%7Cflags%7Csize&format=json&rvlimit=max&titles=';
	url += title;
	request({
		url:url,
		method:"POST",
		json:true,
		headers: { 'Api-User-Agent': 'Example/1.0' },	
	},function(error,response,body){
		if (error){
			callback(1)
		}
		var info = body['query']['pages']
		 for (var index in info){
			 revisionInfo = info[index]
		 }
		title = revisionInfo['title']
		revisions = revisionInfo['revisions']
		for (var item in revisions)
			revisions[item]['title'] = title
		//console.log(revisions[0])
		var selectedTimestamp;
		Revision.find({title:title})
		.sort({'timestamp':-1})
		.limit(1)
		.exec(function(err,result){
			if (err){
				console.log("Query error!")
			}
			else{
				selectedTimestamp = result[0]['timestamp']
			}
			//console.log(selectedTimestamp)
			for (var item in revisions){
				var lastUpdate = Date.parse(selectedTimestamp);
				var newUpdate = Date.parse(revisions[item]['timestamp']);
				// in millisecond
				var timeDiff = newUpdate - lastUpdate;
				// if any update more than one day ago, then update the database
				if (timeDiff > 86400000){
					var insert = (revisions[item])
					console.log(insert);
					Revision.create(insert,function(err,docs){
						if(err) {
							console.log(err);
                        }
					});
					updateArray.push(revisions[item])
				}
			}
			callback(0,updateArray)
		});	
	});
}



//Get article title with most/least revisions
module.exports.MostRevisions = function (num,callback){
	var mostRevisions = [
		{'$group':{'_id':"$title", 'numOfEdits': {$sum:1}}},
		{'$sort':{numOfEdits:-1}},
        {'$limit':num}
	]
	Revision.aggregate(mostRevisions, function(err, results){
		if (err){
			console.log("Aggregation Error in MostRevisions")
			callback(1)
		}else{
			callback(0,results)
		}
	})
}
module.exports.LeastRevisions = function(num,callback){
	var LeastNumberRevisions = [
		{'$group':{'_id':"$title", 'numOfEdits': {$sum:1}}},
		{'$sort':{numOfEdits:1}},
        {'$limit':num}
	]	
	Revision.aggregate(LeastNumberRevisions, function(err, results){
		if (err){
			console.log("Aggregation Error in LeastRevisions")
			callback(1)
		}else{
			callback(0,results)
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
			console.log("Aggregation Error in LargestGroup")
			callback(1)
		}else{
			callback(0,results)
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
			console.log("Aggregation Error in SmallestGroup")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

//Get article title with longest/shortest history
module.exports.top3LongestHistory = function(callback){
	var LongestHistory = [
		{'$group':{'_id':'$title','timestamp':{$min:'$timestamp'}}},
		{'$sort':{timestamp:1}},
        {'$limit':3}
	]
	Revision.aggregate(LongestHistory,function(err,results){
		if (err){
			console.log("Aggregation Error in top3LongestHistory")
			callback(1)
		}else{
			callback(0,results)
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
			console.log("Aggregation Error in ShortestHistory")
			callback(1)
		}else{
			callback(0,results)
		}		
	})	
}


//Get number of anon, bot, admin, regular users
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



//*****************************************************************
//functions for article controller



//Get number of revisions for an article
module.exports.getRevNumTotal = function(title, callback){
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
//Get number of anon,bot,admin,regular users for an article by year
module.exports.getAnonNumByYear = function(title, callback){
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
module.exports.getBotNumByYear = function(title, callback){
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
module.exports.getAdminNumByYear = function(title, callback){
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
module.exports.getUserNumByYear = function(title, callback){
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

//Get top 5 registered(regular) users for an article
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
module.exports.getTop5RevNumByYear = function(title, users, callback){
	var top5ByYear = [
		{'$match':{title:title,user:{"$in":users}}},
		{'$group':{_id:{year:{"$substr":["$timestamp",0,4]},user:'$user'},'numOfEdits':{$sum:1} }},
		{'$sort':{_id:1}}
		]
	Revision.aggregate(top5ByYear,function(err,results){
		if (err){
			console.log("Aggregation Error in revision.js")
			callback(1)
		}else{
			callback(0,results)
		}		
	})
}

//********************************************************************
//Author Analytics
module.exports.getUniqueAuthors = function(callback){
	var uniqueAuthors = [
		{'$match':{user:{'$exists':true}}},
		{'$match':{user:{$ne:""}}},
		{'$group':{_id:'$user','revNum':{$sum:1}}},
		{'$sort':{revNum:-1}}
	]
	Revision.aggregate(uniqueAuthors,function (err,results) {
		if (err){
			console.log('getUniqueAuthors error in revision.js')
			callback(1)
		}
		else{
			callback(0,results)
		}
    })
}
module.exports.getRevsByAuthor = function (author,callback) {
	var revsByAuthor = [
		{'$match':{user:author}},
		{'$group':{_id:{user:'$user',title:'$title',timestamp:'$timestamp'}}},
		{'$sort':{_id:1}}
	]
	Revision.aggregate(revsByAuthor,function (err,results) {
		if (err){
			console.log("author aggregation error in revision.js")
			callback(1)
		}
		else {
			callback(0,results)
		}
    })
}

//*****************************************************************
// for showing the revisions data duration in article controller (facing dataset changes)
module.exports.getDuration = function (callback) {
    var duration = [
        {'$group':{'_id':{"$substr":["$timestamp",0,4]}}},
        {'$sort':{_id:1}}
    ]
	Revision.aggregate(duration,function (err,result) {
		if (err){
			console.log("error in getDuration");
			callback(1)
		}
		else {
			callback(0,result)
		}
    })
}

// for list all articles
module.exports.getArticles = function (callback) {
	var articles = [
        {'$group':{'_id':"$title", 'numOfEdits': {$sum:1}}},
        {'$sort':{'_id':1}}
	]
	Revision.aggregate(articles,function (err,result) {
		if (err){
			console.log('error in getArticles');
			callback(1)
		}
		else {
			callback(0,result);
		}
    })
}


module.exports.addUserType = function (array, usertype,callback){
    Revision.update(
        {user:{"$in":array}},
        {$set:{"usertype":usertype}},
        {'multi':true},
        function(err){
            if(err){
                console.log('error in addUsertype revision.js')
				callback(1)
            }
            else{
                //console.log('add userType to '+array.length+' users')
				callback(0)
            }
        });
}
