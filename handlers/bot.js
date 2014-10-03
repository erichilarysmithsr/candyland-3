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

        }, request.server.app.bots[bot.id].idle * 60000);

        return reply('Bot started!');

    }).error(function(err) {
        return reply('An error occurred: ' + err);
    });

};

exports.start = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models,
        id = request.params.id;

    db.Bot.find(id).success(function(bot) {

        bot.active = true;

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

        }, request.server.app.bots[id].idle * 60000);

        request.server.app.bots[id].active = true;

        bot.save();
    });


    reply('Bot has been started.');
};

exports.stop = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models,
        id = request.params.id;

    db.Bot.find(id).success(function(bot) {

        bot.active = false;

        clearInterval(request.server.app.bots[id].interval);

        request.server.app.bots[id].instances.forEach(function(instance) {
            process.kill(-instance.pid, 'SIGTERM');
        });

        bot.runs += request.server.app.bots[id].runs;
        request.server.app.bots[id].instances = [];
        request.server.app.bots[id].active = false;

        bot.save();
    });

    reply('Bot has been stopped.');
};

exports.delete = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models;

    db.Bot.find(request.params.id).success(function(bot) {

        var id = bot.id;

        clearInterval(request.server.app.bots[id].interval);

        request.server.app.bots[id].instances.forEach(function(instance) {
            process.kill(-instance.pid, 'SIGTERM');
        });

        request.server.app.bots[id] = null;

        bot.destroy()
            .success(function() {
                return reply('Bot has been deleted');
            })
            .error(function(err) {
                return reply('An error occurred: ' + err);
            });
    });
};

exports.update = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models,
        id = request.params.id;

    clearInterval(request.server.app.bots[id].interval);

    request.server.app.bots[id].instances.forEach(function(instance) {
        process.kill(-instance.pid, 'SIGTERM');
    });

    request.server.app.bots[id].instances = [];

    db.Bot.find(id).success(function(bot) {

        bot.name = request.payload.botName;
        bot.target = request.payload.targetSite;
        bot.queries = request.payload.searchQueries;
        bot.idle = request.payload.waitTime;
        bot.runs += request.server.app.bots[id].runs;

        request.server.app.bots[bot.id].name = bot.name;
        request.server.app.bots[bot.id].target = bot.target;
        request.server.app.bots[bot.id].queries = bot.queries;
        request.server.app.bots[bot.id].idle = bot.idle;

        bot.save()
            .success(function() {

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

                return reply('Bot has been updated.');
            })
            .error(function(err) {
                return reply('An error has occurred: ' + err);
            });
    });
};

exports.log = function(request, reply) {

    var log = require('../services/log');

    log.write(request.params.id, request.params.msg);
    reply('message sent');
};