var express = require('express')
var overallController = require('../controllers/overall.server.controller')
var articleController = require('../controllers/article.server.controller')
var landingController = require('../controllers/landing.server.controller')
var authorController = require('../controllers/author.server.controller')
var router = express.Router()

// wiki is used for debugging easily, this line should be delete when deliver
//router.get('/wiki',overallController.renderMainPage)

//Description page
router.get('/',landingController.showDescription)
router.get('/',overallController.addBot)
router.get('/',overallController.addAdmin)

//post to log into Main page
router.post('/',landingController.showMain)

//Sign in page
router.get('/signin',landingController.showSignin)
router.get('/users/user',landingController.checkUser)

//Sign up page
router.get('/signup',landingController.showSignup)
router.get('/users',landingController.addUser)

//Overall analytics
router.get('/mostRevisions',overallController.mostRevisions)
router.get('/leastRevisions',overallController.leastRevisions)
router.get('/largestGroup',overallController.largestGroup)
router.get('/smallestGroup',overallController.smallestGroup)
router.get('/longestHistory',overallController.longestHistory)
router.get('/shortestHistory',overallController.shortestHistory)

// get data for overall analytics charts
router.get('/overallChartData',overallController.getAnon)
router.get('/overallChartData',overallController.getBot)
router.get('/overallChartData',overallController.getAdmin)
router.get('/overallChartData',overallController.getUser)

//get articles list
router.get('/articles',articleController.getAllArticles)

//update article
router.get('/articles/article/revisions',articleController.updateRevs)

//show article data
router.get('/articles/article',articleController.getRevNumTotal)
router.get('/articles/article',articleController.getTop5)
//get data for drawing article charts
router.get('/articles/article',articleController.getAnonNumByYear)
router.get('/articles/article',articleController.getBotNumByYear)
router.get('/articles/article',articleController.getAdminNumByYear)
router.get('/articles/article',articleController.getUserNumByYear)

//get data for drawing article top5 charts
router.get('/articles/article/top5',articleController.getTop5RevNumByYear)

//Author analytics
router.get('/authors',authorController.getUniqueAuthors)
router.get('/authors/author',authorController.getRevsByAuthor)

module.exports = router