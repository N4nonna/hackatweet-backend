var express = require('express');
var router = express.Router();
const Trend = require('../models/trends');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Trending' });
});

/* POST new Trend */
router.get('/hashtag', (req, res) => {
	Trend.find().then(data => {
		if (data) {
			res.json({ result: true, trend: data })
		}
	}
	)
});


router.post('/hashtag/:trend', (req, res) => {

	Trend.findOne({ name: req.params.trend }).then((data) => {
		console.log(data)
		if (!data) {
			const newTrend = new Trend({
				name: req.params.trend,
				tweets: [req.body.tweetId]
			});
			newTrend.save().then(data => {
				res.json({ result: true, message: "new data saved", trend: data });
			});
		} else {
			Trend.updateOne({ name: req.params.trend }, { $addToSet: { tweets: `${req.body.tweetId}` } }).then((data) => {
				if (data.modifiedCount > 0) {
					Trend.findOne({ name: req.params.trend }).then((data) => {
						res.json({ result: true, message: "updated count", trend: data });
					})
				} else {
					res.json({ result: false, error: "tu es nul" })
				}
			})
		}
	})
})  



module.exports = router;