var sys = require('sys'),
    spawn = require('child_process').spawn,
    request = require('request');

var runCount = 0;

// Launch instances on scheudle
exports.spawnBot = function(target, queries, cb) {

    request('http://104.131.214.240:3000/event/STEVEN IS HERE');

    // select a query to use for bot
    // check if query is an array and that it's length is great than one
    var randomQuery = Math.floor(Math.random() * (queries.length - 0) + 0);

    // format query for launch arg
    var	query = queries[randomQuery].split(" ").join("-");

    var instance =
        spawn(
            'casperjs',
            ['../casper/test.js', '--proxy=127.0.0.1:9050', '--proxy-type=socks5', '--target=' + target, '--query=' + query],
            {
                cwd: __dirname,
                detached: true
            }
        );

    // update wait time for next instance
    waitTime = Math.floor((Math.random() * (16 - 11) + 11) * 60000);

    request('http://104.131.214.240:3000/event/Starting run ' + runCount + '.', function(error, response, body) {
        if (response.statusCode == 200) {
            request('http://104.131.214.240:3000/event/Searching Google with query ' + query + ' DANECANDO.com');
        }
    });

    runCount++;


    request('http://104.131.214.240:3000/event/Instances Length: ' + instances.length);


//    (function killLingerer() {
//        if (instances.length > 2) {
//            try {
//                process.kill(-instances[0].pid, 'SIGTERM');
//                instances.shift();
//            } catch (error) {
//                instances.shift();
//            }
//        }
//    }());

    // if (instances.length > 2) {

    // 	var done = false;
    // 	while (!done) {
    // 		try {
    // 			process.kill(-instances[0].pid, 'SIGTERM');
    // 			console.log('cawled');
    // 		} catch (error) {
    // 			console.log(error);
    // 		}
    // 	}


    // 	// var old = instances.shift()
    // 	// process.kill(-old.pid, 'SIGTERM')
    // }

    // for (var i = 0; i < instances.length; i++) {

    // 	instances[i].stdout.on('data', function(data) {
    // 		console.log(data.toString());
    // 	});

    // 	instances[i].on('close', function(code) {
    // 		console.log('child process exited with code' + code);
    // 	});
    // }

    // eventEmitter.emit('newChild');

    // create event listner functions for each bot instance
    // instances[0].stdout.on('data', function(data) {
    // 	console.log(data);
    // });

    cb(instance);
}
