var $ = require('jquery');
//var happy = require('happy');

$(function() {

    $('.toggle input').change(function() {
        if (this.checked) {

            $.ajax({
                type: 'POST',
                url: 'bot/' + $(this).closest('tr').attr('id') + '/start'
            }).done(function(data) {
                console.log(data);
            });

        } else {
            $.ajax({
                type: 'POST',
                url: 'bot/' + $(this).closest('tr').attr('id') + '/stop'
            }).done(function(data) {
                console.log(data);
            });
        }
    });

    $('.delete').click(function(e) {
        e.preventDefault();

        if (confirm('Are you sure you want to delete this bot?')) {
            $.ajax({
                type: 'POST',
                url: 'bot/' + $(this).closest('tr').attr('id') + '/delete'
            }).done(function(data) {
                console.log(data);
            });
        }
    });

    $('.spawn-btn').click(function(e) {
        e.preventDefault();

        var spawn = $('.spawn-form form').serialize();

        $.ajax({
            type: 'POST',
            url: 'bot',
            data: spawn
        }).done(function(data) {
            $('.result').html(data);
        });

    });

    $('.edit-btn').click(function(e) {
        e.preventDefault();

        $('.options-form .fields li').each(function() {
            $(this).find('input, textarea, button').attr('disabled', false);
        });
    });

    $('.update-btn').click(function(e) {
        e.preventDefault();

        var update = $('.options-form form').serialize();

        $.ajax({
            type: 'POST',
            url: window.location.pathname + '/update',
            data: update
        }).done(function(data) {
            $('.result').html(data);
        });
    });

    $('.accordion-tabs').each(function(index) {
        $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    });

    $('.accordion-tabs').on('click', 'li > a', function(event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            var accordionTabs = $(this).closest('.accordion-tabs');
            accordionTabs.find('.is-open').removeClass('is-open').hide();

            $(this).next().toggleClass('is-open').toggle();
            accordionTabs.find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else {
            event.preventDefault();
        }
    });

});