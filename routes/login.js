var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let isLogin = req.session.user;
  if(!isLogin){
    res.render('login');
  }
});

module.exports = router;
