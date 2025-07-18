const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
	text: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	likes: [String],
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
});
const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;