var user = require("../models/user.js")

module.exports.showSignin=function(req,res){
    res.render('signin.pug')
}
module.exports.showDescription=function(req, res,next){
    res.render('description.pug');
    next();
}
module.exports.showMain=function(req,res){
    if (req.body.loginCredential=='true'){
        res.render('main.pug',{email:req.body.email});
    }
}

module.exports.addUser=function(req,res,next) {
    var firstname=req.query.firstname;
    var lastname=req.query.lastname;
    var username=req.query.username;
    var email=req.query.email;
    var password=req.query.password;
    if (firstname&&lastname&&username&&email&&password) {
        var newUser = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password
        };
    }
    else {
        console.log("Some field is null!")
    }
    user.createUser(newUser,function (err) {
        if (err!=0){
            console.log('error!')
            res.json({inDatabase:false});
        }
        res.json({inDatabase:true});
    });
}

module.exports.showSignup=function(req,res){
    res.render('signup.pug')
}

module.exports.checkUser=function (req,res,next) {
    //console.log(req.body)
    var email=req.query.email;
    var password=req.query.password;
    var signinUser = {
        email:email,
        password:password
    }
    user.findUserByEmail(signinUser,function (err, result) {
        if (err!=0){
            console.log('error in checkUser landing controller')
            res.json({loginCredential:false});
        }
        else {
            if (result.length) {
                if (password == result[0].password) {
                    console.log('signed in!');
                    res.json({loginCredential: true});
                }
                else {
                    res.json({loginCredential: false});
                }
            }
            else {
                res.json({loginCredential:false});
            }
        }
    })
}