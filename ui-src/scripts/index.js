var $ = require('jquery');

$(function() {

    $('#spawn-btn').click(function(e) {
        e.preventDefault();

        var spawn = $('.spawn-form form').serialize();

        $.ajax({
            type: 'POST',
            url: 'bot',
            data: spawn
        }).done(function(data) {
            $('.result').html(data);
        });

    })

});