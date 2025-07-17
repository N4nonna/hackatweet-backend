const mongoose = require('mongoose');

const trendSchema = mongoose.Schema({
	name: String,
	nbTweets: [ ObjectId ],
});
const Trend = mongoose.model('trends', trendSchema);

module.exports = Trend;