var Hapi = require('Hapi'),
    Hoek = require('hoek');
    config = require('./config'),
    routes = require('./routes'),
    manager = require('./services/manager'),
    internals = {};

var server = new Hapi.Server(config.host, config.port, config.server);

server.app.bots = [];

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.route(routes.endpoints);

server.on('internalError', function(request, error) {
    console.log(error);
});

server.ext('onPreResponse', function(request, reply) {

    if (request.response.isBoom) {
        var error = request.response;
        return reply.view('error', error).code(request.response.output.statusCode);
    }

    // global context
    if (request.response.variety === 'view') {
        var context = {};

        request.response.source.context = Hoek.applyToDefaults(context, request.response.source.context || {});
    }

    reply();
});

server.pack.register([
    {
        plugin: require('good'),
        options: {
            opsInterval: '60000',
            extendedRequests: true,
            subscribers: {
                'console': ['request', 'log', 'error']
            }
        }
    },
    {
        plugin: require('./models'),
        options: {
            database: config.database.name,
            user: config.database.user,
            pass: config.database.pass,
            dialect: 'mysql'
        }
    }
], function(err) {
    if (err) throw err;

    var models = server.plugins['candyland-models'].models;
    models
    .sequelize
    .sync()
    .complete(function(err) {
        if (err) throw err[0];
        else {
            server.start(function() {
                console.log('Server running at: ', server.info.uri);
            });
        }
    });

    // load all bots into the application state
    models.Bot.findAll().success(function(results) {

        results.forEach(function(bot) {

            server.app.bots[bot.id] = {
                id: bot.id,
                name: bot.name,
                target: bot.target,
                queries: bot.queries,
                instances: [],
                active: bot.active,
                idle: bot.idle,
                runs: 0,
                interval: null
            };

            if (bot.active) {

                server.app.bots[bot.id].interval = setInterval(function() {

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

                    manager.spawnBot(bot.target, bot.queries, function(instance) {
                        server.app.bots[id].instances.push(instance);
                    });

                    server.app.bots[id].runs++;

                }, server.app.bots[bot.id].idle * 60000);
            }
        });
    });
});