var user = require("../models/user.js")

module.exports.showSignup=function(req,res){
    res.render('signup.pug')
}
module.exports.showSignin=function(req,res){
    res.render('signin.pug')
}

module.exports.addUser=function(req,res) {
    firstname=req.query.firstname;
    lastname=req.query.lastname;
    username=req.query.username;
    email=req.query.email;
    console.log(email);
    password=req.query.password;

    var user1 = {
        firstname:firstname,
        lastname:lastname,
        username:username,
        email:email,
        password:password
    };
    user.saveUser(user1);
    res.redirect('/');
}

module.exports.checkUser=function (req,res) {
    email=req.query.email;
    password=req.query.password;
    console.log(password);
    var signinUser = {
        email:email,
        password:password
    }
    user.checkUser(signinUser,function (err,result) {
        if (err!=0){
            console.log('error')
        }
        else{
            console.log(result[0]);
            if(password==result[0].password){
                console.log('signed in!');
                res.redirect('/wiki');
            }
        }
    })
}