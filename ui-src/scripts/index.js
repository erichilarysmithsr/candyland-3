var $ = require('jquery');

$(function() {

    $('.toggle input').change(function() {
        if (this.checked) {

            $.ajax({
                type: 'POST',
                url: 'bot/' + $(this).attr('id') + '/start'
            }).done(function(data) {
                console.log(data);
            });

        } else {
            $.ajax({
                type: 'POST',
                url: 'bot/' + $(this).attr('id') + '/stop'
            }).done(function(data) {
                console.log(data);
            });
        }
    });

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