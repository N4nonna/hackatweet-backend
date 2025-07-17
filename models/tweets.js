const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
	text: String,
	time: Date,
	nbLikes: [ ObjectId ],
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
});
const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;