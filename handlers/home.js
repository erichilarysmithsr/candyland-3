exports.get = function(request, reply) {
//    console.log(request.server.app.bots[1].instances);
    console.log(request.server.app.bots[1]);
    reply.view('index', { title: 'Steven v2', bots: request.server.app.bots });
};