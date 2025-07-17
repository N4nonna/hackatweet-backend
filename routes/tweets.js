var express = require('express');
var router = express.Router();

/* GET tweet page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'tweet' });
});

module.exports = router;