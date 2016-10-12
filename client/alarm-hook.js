var MPlayer = require("mplayer");
var path = require("path");
var debug = require('debug')('alarm-hook');

module.exports = function(app) {

    var mPlayer = new MPlayer({debug: false, verbose: false});
    var playing = false;
    var filePath = path.join(app.locals.config.resourcesPath, "/Alarm09.wav");
    // we force POSIX path because I do not understand why but windows separator (\) does not work.
    filePath = filePath.replace(new RegExp('\\' + path.sep, 'g'), '/');

    // make sure io exist
    app.once("ring:io:connect", function() {

        // listen for ring start
        // We do not have to clean the listener as we listen once for the connect. It means that when reconnecting the event will start
        // firing again. We could have listen on connect and clean on disconnect as well.
        app.io.on("event:ring:start", function() {
            debug("new ring command");
            startAlarm();
        });
    });

    function startAlarm() {
        if (playing) {
            debug("already playing, skip demand");
            return;
        }

        playing = true;

        mPlayer.openFile(filePath);

        mPlayer.on("stop", function() {
            playing = false;
        });
    }
};