var mongoose = require('mongoose')

/*var uri = "mongodb+srv://hyk:Srhongyangkai1994@yangkai-hong-mdsnm.mongodb.net/wikipedia";
mongoose.connect(uri,function () {
    console.log('mongodb connected')
});*/
mongoose.connect('mongodb://localhost/wikipedia',function () {
    console.log('mongodb connected')
});

var userSchema = new mongoose.Schema(
    {
        firstname:String,
        lastname:String,
        username:String,
        email:String,
        password:String
    },
    {
        versionKey:false
    }
)
var User = mongoose.model('User',userSchema,'users')

module.exports.createUser = function(user,callback) {
    User.find({email:user.email},function (err,result) {
        if (result.length){
            User.update(
                {email:user.email},
                {$set:{firstname:user.firstname,
                        lastname:user.lastname,
                        username:user.username,
                        password:user.password}},
                function (err) {
                    if (err){
                        console.log(err);
                        callback(1);
                    }
                    else {
                        callback(0);
                    }
                }
            )
        }
        else {
            User.create(user, function (err) {
                if (err) {
                    console.log(err);
                    callback(1);
                }
                else {
                    callback(0);
                }
            })
        }
    })
}
module.exports.findUserByEmail =function (user, callback) {
    var user=[
        {'$match':{email:user.email}}
    ]
    User.aggregate(user,function (err,result) {
            if (err){
                console.log("findUserByEmail aggregation error");
                callback(1)
            }
            else{
                callback(0,result)
            }
        })
}


