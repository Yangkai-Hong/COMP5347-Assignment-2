var revision = require("../models/revision.js")

module.exports.getRevsByAuthor = function (req,res) {
    var author = req.query.author;
    revision.getRevsByAuthor(author,function (err,result) {
        if(err!=0){
            res.json({'author':'error'})
        }
        else{
            res.json(result)
        }
    })
}
module.exports.getUniqueAuthors = function (req,res) {
    revision.getUniqueAuthors(function (err,result) {
        if (err!=0){
            res.json({'authors':'error'})
        }
        else{
            res.json(result)
        }
    })
}