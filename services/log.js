var fs = require('fs'),
    path = require('path'),
    moment = require('moment');

exports.write = function(id, message, run, type) {

    var file = path.join(__dirname, '../logs/' + id + '.json');

    fs.readFile(file, function(err, data) {

        var log = (data ? JSON.parse(data) : []);

        if (log.length > 200) {
            log.pop();
        }

        log.unshift({
            run: run,
            type: type,
            time: moment().format('ddd h:mm:ssa'),
            message: message
        });

        fs.writeFile(file, JSON.stringify(log));
    });

    console.log(message);
};

exports.load = function(id) {

    var file = path.join(__dirname, '../logs/' + id + '.json');

    try {
        var log = fs.readFileSync(file);
        return (log ? JSON.parse(log) : []);
    } catch(error) {
        return [];
    }
};

exports.delete = function(id) {

    var file = path.join(__dirname, '../logs/' + id + '.json');

    fs.unlink(file, function(err) {
        if (err) throw err;
    });
};