var fs = require('fs'),
    path = require('path');

var logDir = path.join(__dirname, '../logs');

exports.write = function(id, message) {

//    fs.writeFile(path.join(logDir, id + '.json'), message, function(err) {
//        console.log(err);
//    });


//    var entry = {
//        time
//    }

    fs.writeFile(path.join(logDir, id + '.json'), )

    console.log(message);
};