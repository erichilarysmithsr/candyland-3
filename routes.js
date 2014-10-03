var home = require('./handlers/home'),
    bot = require('./handlers/bot');

exports.endpoints = [

    { method: 'GET', path: '/', handler: home.get },

    { method: 'GET', path: '/bot/{id?}', handler: bot.get },
    { method: 'POST', path: '/bot', handler: bot.post },
    { method: 'POST', path: '/bot/{id}/stop', handler: bot.stop },
    { method: 'POST', path: '/bot/{id}/start', handler: bot.start },
    { method: 'POST', path: '/bot/{id}/delete', handler: bot.delete },
    { method: 'POST', path: '/bot/{id}/update', handler: bot.update },
    { method: 'POST', path: '/bot/{id}/error/{msg}', handler: bot.error },
    { method: 'POST', path: '/bot/{id}/status/{msg}', handler: bot.status }

];