var express = require('express');
var router = express.Router();
require('../models/connection');

const Tweet = require('../models/tweets');
const User = require('../models/users');

// POST new tweet.
router.post('/', function(req, res) {
	console.log(req.body);
	User.findOne({ token: req.body.token }).then(data => {
		if(data) {
			const newTweet = new Tweet({
				text: req.body.tweet,
				createdAt: Date.now(),
				likes: [''],
				user: data._id,
			});
			newTweet.save().then(() => {
				Tweet.find().populate({ path: 'user', select: 'name username pp -_id' }).then(tweets => {
					if(tweets[0])
						res.json({result: true, tweets});
					else
						res.json({ result: false, error: "No tweets registered." });
				});
			})
		} else
			res.json({return: false, error: 'Wrong token.'});
	});
});

// GET all tweets
router.get('/', function(req, res) {
	Tweet.find().populate({ path: 'user', select: 'name username pp -_id' }).then(tweets => {
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
      Tweet.find().populate({ path: 'user', select: 'name username pp -_id' }).then(data => {
				if (data[0])
          res.json({ result: true, tweets: data });
				else
					res.json({ result: false, error: 'No tweet registered.' });
      });
    } else
      res.json({ result: false, error: "No tweets deleted." });
	});
});

// UPDATE likes count depending on if user already liked the tweet or not
router.put('/', function(req, res) {
	let userId;
	User.findOne({ token: req.body.token }).then(data => {
		if(data) {
			userId = data._id.toString();
			Tweet.findOne({ '_id': req.body.tweetId }).then(data => {
				if(data.likes.some(e => e === userId)) {
					Tweet.updateOne({ '_id': req.body.tweetId }, { $pull: { likes: `${userId}` } }).then(data => {
						if(data) {
							Tweet.findOne({ '_id': req.body.tweetId }).then(tweetData => {
								res.json({ result: true, likes: tweetData.likes.length });
							});
						};
					});
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