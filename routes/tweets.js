var express = require('express');
var router = express.Router();
require('../models/connection');

const Tweet = require('../models/tweets');
const User = require('../models/users');

// POST new tweet.
router.post('/', function(req, res) {
	User.findOne({ token: req.body.token }).then(data => {
		if(data) {
			const newTweet = new Tweet({
				text: req.body.tweet,
				createdAt: Date.now(),
				likes: [],
				user: data._id,
			});
			newTweet.save();
			res.json({result: true, token: data.token});
			return ;
		}
		res.json({return: false, error: 'Wrong token.'});
	});
});

// GET all tweets
router.get('/', function(req, res) {
	Tweet.find().then(tweets => {
		if(tweets[0])
			res.json({result: true, tweets });
		else
			res.json({ result: false, error: "No tweets registered." });
	});
});

// DELETE one tweet and return all tweets left
router.delete('/', function(req, res) {
	Tweet.deleteOne({ '_id': req.body.tweetId }).then(deletedDoc => {
		if (deletedDoc.deletedCount > 0) {
      // document successfully deleted and return all tweets
      Tweet.find().then(data => {
				if (data[0])
          res.json({ result: true, tweets: data });
				else
					res.json({ result: false, error: 'No tweet registered.' });
      });
    } else
      res.json({ result: false, error: "No tweets deleted." });
	});
});

router.put('/', function(req, res, next) {
	let userId;
	User.findOne({ token: req.body.token }).then(data => {
		if(data) {
			userId = data._id.toString();
			Tweet.findOne({ '_id': req.body.tweetId }).then(data => {
				if(data.likes.includes(userId)) {
					data.likes = data.likes.splice(userId, 1);
					res.json({ result: true, likes: data.likes.length });
				} else {
					Tweet.updateOne({ '_id': req.body.tweetId }, { $addToSet: { likes: [`${userId}`] } }).then(data => {
						if(data) {
							Tweet.findOne({ '_id': req.body.tweetId }).then(tweetData => {
								res.json({ result: true, likes: tweetData.likes.length });
							});
						};
					});
				}
			});
		};
	});
});

module.exports = router;