var config = {};

config.env = process.env.NODE_ENV || 'dev';
config.host = 'localhost';
config.port = (process.env.NODE_ENV == 'production' ? 5250 : 5200);
config.server = {
    views: {
        path: './views',
        partialsPath: './views/partials',
        helpersPath: './views/helpers',
        layout: 'default',
        layoutPath: './views/layouts',
        engines: {
            hbs: require('handlebars')
        },
        compileOptions: {
            colons: true,
            pretty: true
        }
    }
}

if (process.env.NODE_ENV != 'production') {
    config.database = {
        name: 'steven',
        user: 'root',
        pass: 'root'
    };
}

module.exports = config;