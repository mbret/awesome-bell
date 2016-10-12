var express = require('express');
var router = express.Router();
var path = require("path");

/**
 * Index
 */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.post("/ring", function(req, res) {
    if (req.app.locals.socket) {
        req.app.locals.socket.emit("event:ring:start");
    }
    return res.json();
});

module.exports = router;
