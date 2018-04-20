var express = require('express')
var controller_Overall = require('../controllers/Assignment2.Overall.server.controller')
var controller_Article = require('../controllers/Assignment2.Article.server.controller')
var router = express.Router()

router.get('/',controller_Overall.add_admin)
router.get('/',controller_Overall.add_bot)

router.get('/',controller_Overall.getName)
router.get('/',controller_Overall.MostRevisions)
router.get('/',controller_Overall.LeastRevisions)
router.get('/',controller_Overall.SmallestGroup)
router.get('/',controller_Overall.LargestGroup)
router.get('/',controller_Overall.LongestHistory)
router.get('/',controller_Overall.ShortestHistory)


router.get('/getChartData',controller_Overall.getAnon)
router.get('/getChartData',controller_Overall.getBot)
router.get('/getChartData',controller_Overall.getAdmin)
router.get('/getChartData',controller_Overall.getUser)



router.get('/update',controller_Article.update)

router.get('/getDataForArticle',controller_Article.getTotal)
router.get('/getDataForArticle',controller_Article.getTop5)
router.get('/getDataForArticle',controller_Article.getAnon)
router.get('/getDataForArticle',controller_Article.getBot)
router.get('/getDataForArticle',controller_Article.getAdmin)
router.get('/getDataForArticle',controller_Article.getUser)


router.get('/getDataForTop5',controller_Article.getTop5Data)




module.exports = router