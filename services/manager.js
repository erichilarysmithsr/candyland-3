var spawn = require('child_process').spawn,
    request = require('request');

var runCount = 0;

exports.spawnBot = function(bot, cb) {

    request('http://104.131.214.240:3000/event/' + bot.name + ' started');

    var queries = bot.queries.split(", ");
    var randomQuery = Math.floor(Math.random() * (queries.length - 0) + 0);
    var	query = queries[randomQuery].split(" ").join("_");

    var instance =
        spawn(
            'casperjs',
            ['../casper/steven.js', '--proxy=127.0.0.1:9050', '--proxy-type=socks5', '--target=' + bot.target, '--query=' + query],
            {
                cwd: __dirname,
                detached: true
            }
        );

    request('http://104.131.214.240:3000/event/Starting run ' + runCount + '.', function(error, response, body) {
        if (response.statusCode == 200) {
            request('http://104.131.214.240:3000/event/Searching Google with query ' + query + ' ' + bot.target);
        }
    });

    runCount++;

    cb(instance);
}
