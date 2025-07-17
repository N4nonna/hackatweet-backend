var express = require('express');
var router = express.Router();
require('../models/connection');

const Tweet = require('../models/tweets');
const User = require('../models/users');

/* POST new tweet. */
router.post('/', function(req, res) {
	User.findOne({ token: req.body.token }).then(data => {
		if(data) {
			const newTweet = new Tweet({
				test: req.body.tweet,
				createdAt: Date.now(),
				likes: [],
				user: data._id,
			});
			newTweet.save();
			res.json({result: true});
		}
		res.json({return: false, error: 'Wrong token.'});
	})
});

module.exports = router;