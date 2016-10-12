var express = require('express');
var router = express.Router();
var path = require("path");
var jwt = require('jsonwebtoken');

/**
 * Index
 */
router.get('/', function(req, res) {
    res.render('index', { alias: req.app.locals.config.hostAlias });
});
router.get("/configuration.js", function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    res.send('window.APP_CONFIG = ' + JSON.stringify( {
            hostAlias: req.app.locals.config.hostAlias
        } ) + ';');
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

router.post("/auth", function(req, res) {
    var password = req.body.password;

    if (password === req.app.locals.config.adminPassword) {
        return res.status(200).json({
            token: jwt.sign({role: "admin"}, req.app.locals.config.tokenSecret)
        });
    }

    return res.status(400).json({});
});

module.exports = router;
