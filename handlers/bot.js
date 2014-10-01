var manager = require('../services/manager');

exports.get = function(request, reply) {
    var bot = request.server.app.bots[request.params.id];
    reply.view('bot', bot);
};

exports.post = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models;

    db.Bot.create({
        name: request.payload.botName,
        target: request.payload.targetSite,
        queries: request.payload.searchQueries,
        idle: request.payload.waitTime,
        runs: 0,
        active: true
    }).success(function(bot) {

        request.server.app.bots[bot.id] = {
            id: bot.id,
            name: bot.name,
            target: bot.target,
            queries: bot.queries,
            instances: [],
            active: true,
            idle: bot.idle,
            runs: 0,
            interval: null
        };

        request.server.app.bots[bot.id].interval = setInterval(function() {

            var id = bot.id;

            if (server.app.bots[id].instances.length >= 2) {
                try {
                    process.kill(-server.app.bots[id].instances[0].pid, 'SIGTERM');
                    server.app.bots[id].instances.shift();
                } catch (error) {
                    server.app.bots[id].instances.shift();
                    console.log(error);
                }
            }

            manager.spawnBot(request.server.app.bots[id], function(instance) {
                request.server.app.bots[id].instances.push(instance);
            });

            server.app.bots[id].runs++;

        }, request.server.app.bots[bot.id].idle * 60000);

        reply('Bot started!');

    }).error(function(err) {
        reply('An error occurred: ' + err);
    });

};

exports.start = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models;

    db.Bot.find(request.params.id).success(function(bot) {

        bot.active = true;

        var id = request.params.id;

        request.server.app.bots[id].interval = setInterval(function() {

            if (request.server.app.bots[id].instances.length >= 2) {
                try {
                    process.kill(-request.server.app.bots[id].instances[0].pid, 'SIGTERM');
                    request.server.app.bots[id].instances.shift();
                } catch (error) {
                    request.server.app.bots[id].instances.shift();
                    console.log(error);
                }
            }

            manager.spawnBot(request.server.app.bots[id], function(instance) {
                request.server.app.bots[id].instances.push(instance);
            });

            request.server.app.bots[id].runs++;

        }, request.server.app.bots[request.params.id].idle * 60000);

        request.server.app.bots[id].active = true;

        bot.save();
    });


    reply('Bot has been started.');
};

exports.stop = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models;

    db.Bot.find(request.params.id).success(function(bot) {

        bot.active = false;

        var id = request.params.id;

        clearInterval(request.server.app.bots[id].interval);

        request.server.app.bots[id].instances.forEach(function(instance) {
            try {
                process.kill(-instance.pid, 'SIGTERM');
            } catch (error) {
                console.log(error);
            }
        });

        bot.runs += request.server.app.bots[id].runs;
        request.server.app.bots[id].instances = [];
        request.server.app.bots[id].active = false;

        bot.save();
    });

    reply('Bot has been stopped.');
};