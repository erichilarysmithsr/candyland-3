var home = require('./handlers/home'),
    bot = require('./handlers/bot');

exports.endpoints = [

    { method: 'GET', path: '/', handler: home.get },

    { method: 'GET', path: '/bot/{id?}', handler: bot.get },
    { method: 'POST', path: '/bot', handler: bot.post },
    { method: 'POST', path: '/bot/{id}/stop', handler: bot.stop },
    { method: 'POST', path: '/bot/{id}/start', handler: bot.start }


];