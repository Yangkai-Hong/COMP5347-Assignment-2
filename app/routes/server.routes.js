var express = require('express')
var overallController = require('../controllers/overall.server.controller')
var articleController = require('../controllers/article.server.controller')
var landingController = require('../controllers/landing.server.controller')
var authorController = require('../controllers/author.server.controller')
var router = express.Router()

//Description page
router.get('/',landingController.showDescription)

//Sign in page
router.get('/signin',landingController.showSignin)
router.get('/user',landingController.checkUser)
//Sign up page
router.get('/signup',landingController.showSignup)
router.get('/users',landingController.addUser)

//Main page
router.get('/mostRevisions',overallController.MostRevisions)
router.get('/leastRevisions',overallController.LeastRevisions)
router.get('/smallestGroup',overallController.SmallestGroup)
router.get('/largestGroup',overallController.LargestGroup)
router.get('/longestHistory',overallController.LongestHistory)
router.get('/shortestHistory',overallController.ShortestHistory)

router.get('/wiki',overallController.renderMainPage)

// addBot first, then addAdmin (Because we count users that are both bot and admin as ADMIN
router.get('/wiki',overallController.addBot)
router.get('/wiki',overallController.addAdmin)

router.get('/overallChartData',overallController.getAnon)
router.get('/overallChartData',overallController.getBot)
router.get('/overallChartData',overallController.getAdmin)
router.get('/overallChartData',overallController.getUser)

router.get('/revisions',articleController.updateRevs)

router.get('/articles',articleController.getRevNumTotal)
router.get('/articles',articleController.getTop5)
router.get('/articles',articleController.getAnonNumByYear)
router.get('/articles',articleController.getBotNumByYear)
router.get('/articles',articleController.getAdminNumByYear)
router.get('/articles',articleController.getUserNumByYear)

router.get('/articles/top5',articleController.getTop5RevNumByYear)

router.get('/authors',authorController.getUniqueAuthors)
router.get('/authors/author',authorController.getRevsByAuthor)

module.exports = router