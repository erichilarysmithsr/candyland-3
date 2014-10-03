var spawn = require('child_process').spawn,
    Wreck = require('wreck'),
    config = require('../config');

exports.spawnBot = function(bot, cb) {

    var url = 'http://' + config.host + ':' + config.port;
    var logString = url + '/bot/' + bot.id + '/';

    Wreck.post(logString + 'status/' + bot.name + ' starting run ' + bot.runs, function(err, res, payload) {
        if (err) throw err;
    });

    var queries = bot.queries.split(", ");
    var randomQuery = Math.floor(Math.random() * (queries.length - 0) + 0);
    var	query = queries[randomQuery].split(" ").join("_");

    var instance =
        spawn(
            'casperjs',
            ['../casper/steven.js', '--proxy=127.0.0.1:9050', '--proxy-type=socks5', '--target=' + bot.target, '--query=' + query, '--log=' + logString, '--id=' + bot.id],
            {
                cwd: __dirname,
                detached: true
            }
        );

    cb(instance, bot.id);
}
