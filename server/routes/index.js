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
    if (req.app.locals.sleepMode) {
        console.info("sleep mode enabled, ignore ring");
        return res.status(400).json({
            code: "sleepMode"
        });
    }
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

router.put("/state", function(req, res) {
    var sleep = req.body.sleep ? req.body.sleep === "true" : undefined;

    if (sleep === true) {
        console.info("enter sleep mode");
        req.app.locals.sleepMode = true;
    } else if (sleep === false) {
        console.info("leave sleep mode");
        req.app.locals.sleepMode = false;
    }

    return res.status(200).json();
});

module.exports = router;
