var manager = require('../services/manager');

exports.get = function(request, reply) {
    var bot = request.server.app.bots[request.params.id];
    var queries = bot.queries.split(', ');
    console.log(queries);
    reply.view('bot', bot);
};

exports.post = function(request, reply) {

    var db = request.server.plugins['candyland-models'].models;

    db.Bot.create({
        name: request.payload.botName,
        target: request.payload.targetSite,
        queries: request.payload.searchQueries,
        active: true
    }).success(function(bot) {

        request.server.app.bots[bot.id] =
        {
            id: bot.id,
            name: bot.name,
            target: bot.target,
            queries: bot.queries,
            instances: [],
            active: true,
            runs: 0
        };

        setInterval(function() {

            var id = bot.id;

            if (server.app.bots[id].instances.length >= 3) {
                try {
                    process.kill(-server.app.bots[id].instances[0].pid, 'SIGTERM');
                    server.app.bots[id].instances.shift();
                } catch (error) {
                    server.app.bots[id].instances.shift();
                    console.log(error);
                }
            }

            manager.spawnBot(bot.target, queries, function(instance) {
                server.app.bots[bot.id].instances.push(instance);
            });

            server.app.bots[id].runs++;

        }, Math.floor(15 * 60000));

        reply('Bot started!');

    }).error(function(err) {
        reply('An error occurred: ' + err);
    });

};

exports.start = function() {

};

exports.stop = function() {

};