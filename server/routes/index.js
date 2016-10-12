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
    if (req.app.locals.socketRingClient) {
        console.info("send ring event");
        req.app.locals.socketRingClient.emit("ring");
        return res.status(202).json();
    }
    return res.status(200).json();
});

router.get("/client", function(req, res) {
    if (req.app.locals.socketRingClient) {
        return res.json({});
    }

    return res.status(404).json({});
});

module.exports = router;
