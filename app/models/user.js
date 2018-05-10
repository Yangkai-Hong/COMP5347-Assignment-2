var mongoose = require('mongoose')

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
    }
)
var User = mongoose.model('User',userSchema,'users')

module.exports.saveUser = function(data) {
    User.create(data, function (err) {
        if (err) return handleError(err);
        // saved!
    })
}
module.exports.checkUser =function (data,callback) {
    var checkUser = [
        {'$match':{email:data.email}}
    ]
    User.aggregate(checkUser,function (err,results) {
        if (err){
            console.log("Aggregation error");
            callback(1)
        }
        else{
            callback(0,results)
        }
    })
}
