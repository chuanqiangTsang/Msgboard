var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.session.user){
        res.render('update')
    }else{
        res.redirect('/')
    }
});
module.exports = router;
