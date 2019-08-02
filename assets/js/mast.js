$(function () {
    // Desktop only
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mast_init_youtube();
    // Mobile only
    } else {
        mast_prep_mobile_menu();
    }

    // Universal
    mast_lift_embargoes();
    mast_cycle_statements();
    mast_init_discord();
    mast_prep_cognito();
    mast_render_video();
    mast_prompt_lab('bonanzamonth');
    mast_prep_playlist_carousel();
});

function mast_init_youtube(which) {
    var videos = [
        {
            id: "wsquzyv2lXc",
            start: 1,
            duration: 58,
            title: "Sea Haunt",
            attribution: "KC Tobey"
        },
        {
            id: "ZIl0Nqpt41A",
            start: 20,
            duration: 90,
            title: "Navajo Tales: The Stars",
            attribution: "Julia Berrio et al",
            zoom: 1.4
        },
        {
            id: "81DcP1jO1u0",
            start: 60,
            duration: 180,
            title: "Warrior",
            attribution: "Cole Sax and Jacob Callaghan",
            zoom: 1.4
        },
        {
            id: "uawLHDmu9C4",
            start: 10,
            duration: 47,
            title: "Community Patrol",
            attribution: "Andrew James"
        }
    ];
    which = which || (Math.floor(Math.random() * videos.length));
    var next = which + 1;
    if (next > (videos.length - 1)) {
        next = 0;
    }

    $("#youtube").children().remove();
    $("#youtube").append('<iframe class="canvas" width="100%" height="100%" src="//www.youtube.com/embed/' + videos[which]["id"] + '?start=' + videos[which]["start"] + '&autoplay=1&showinfo=0&controls=0&mute=1&enablejsapi=1" frameborder="0" allow="autoplay"></iframe>');
    $("#youtube").append('<div class="info"><div class="nod">A MAST nod to:</div><a class="title" target="_NEW" href="https://youtube.com/watch?v=' + videos[which]["id"] + '">' + videos[which]["title"] + '</a><div class="attribution">' + videos[which]["attribution"] + "</div></div>");
    $("#youtube .canvas").css("transform", "scale(" + (window.innerHeight / window.innerWidth * 2.4 * (videos[which]["zoom"] || 1)) + ")");

    setTimeout(function () {
        mast_init_youtube(next);
    }, videos[which]["duration"] * 1000);

    $(window).resize(function () {
        $("#youtube .canvas").css("transform", "scale(" + (window.innerHeight / window.innerWidth * 2.4 * (videos[which]["zoom"] || 1)) + ")");
    });
}

function mast_init_discord() {
    $('#discord').append('<iframe src="https://discordapp.com/widget?id=527546933494022144&theme=dark" width="275" height="400" allowtransparency="true" frameborder="0"></iframe>');

    $('#discord .button').click(function () {
        $('#discord').toggleClass('active').children('.button').toggleClass('xcon-chat').toggleClass('xcon-cancel-circled');
    });
}

function mast_cycle_statements(which) {
    var statements = $('.macro_tm_content #home .statement a');
    which = which || 0;
    var next = which + 1;
    if (next > (statements.length - 1)) {
        next = 0;
    }

    statements.removeClass("hovered");
    $(statements[which]).addClass("hovered");

    var nextTimeout = setTimeout(function () {
        mast_cycle_statements(next);
    }, 2500);

    $('.macro_tm_content #home .statement').hover(function () {
        statements.removeClass("hovered");
        clearTimeout(nextTimeout);
    })
}

function mast_prep_mobile_menu() {
    $('.macro_tm_mobile_menu_wrap .anchor_nav a').click(function () {
        $('.macro_tm_mobile_menu_wrap').slideUp();
        $('.hamburger').removeClass('is-active');
    });
}

function mast_prep_cognito() {
    $('.cognito').addClass('active').children('[data-field=ContestAndLicensingTerms] textarea').first().attr('disabled', 'disabled');
}

function mast_render_video() {
    if ($('.youtube').length) {
        $('head').prepend('<script src="https://www.youtube.com/iframe_api"></script>');
    }

    if ($('.vimeo').length) {
        onVimeoIframeAPIReady();
    }

    $(window).resize(function () {
        var $el = $('.player iframe'),
            x = $el.attr('width'),
            y = $el.attr('height'),
            ratio = y / x;

        $el.attr('width', $(window).width());
        $el.attr('height', $(window).width() * ratio);

        setPlayerWrapperSize($(window).width(), $(window).width() * ratio);
    });
}

function setPlayerWrapperSize(x, y) {
    x = x || $('.player iframe').width();
    y = y || $('.player iframe').height();

    $('.player').css('width', x);
    $('.player').css('height', y);
}

function onYouTubeIframeAPIReady() {
    window.YouTubePlayers = [];

    $('.youtube').each(function (k, v) {
        var $el = $(v),
            player = new YT.Player($el.attr('id'), {
                width: $el.parent().width(),
                height: $el.parent().width() * 0.56,
                videoId: $el.attr('id'),
                playerVars: { showinfo: 0 },
                events: {
                    'onReady': onYouTubePlayerReady,
                    'onStateChange': onYouTubePlayerStateChange
                }
            });

        setPlayerWrapperSize();

        window.YouTubePlayers.push(player);
    });
}

function onYouTubePlayerReady() {
}

function onYouTubePlayerStateChange(event) {
    if ([YT.PlayerState.UNSTARTED, YT.PlayerState.ENDED, YT.PlayerState.PAUSED].includes(event.data)) {
        setTimeout(function () {
            if (window.YouTubePlayers[0].getPlayerState() != YT.PlayerState.PLAYING) {
                $('body').removeClass('subtle');
                $('.player').removeClass('playing');
            }
        }, 1000);
    } else {
        setTimeout(function () {
            if (window.YouTubePlayers[0].getPlayerState() == YT.PlayerState.PLAYING) {
                $('body').addClass('subtle');
                $('.player').addClass('playing');
            }
        }, 1000);
    }
}

function onVimeoIframeAPIReady() {
    window.VimeoPlayers = [];

    $('.vimeo').each(function (k, v) {
        var $el = $(v);

        var player = new Vimeo.Player($el.attr('id'), {
            width: $el.parent().width(),
            id: $el.attr('id'),
        });

        setTimeout(function () {
            setPlayerWrapperSize();
        }, 1000);

        player.on('play', function () { onVimeoPlayerStateChange('PLAYING') });
        player.on('pause', function () { onVimeoPlayerStateChange('PAUSED') });

        window.VimeoPlayers.push(player);
    });
}

function onVimeoPlayerStateChange(state) {
    if (state == 'PLAYING') {
        $('body').addClass('subtle');
        $('.player').addClass('playing');
    } else {
        $('body').removeClass('subtle');
        $('.player').removeClass('playing');
    }
}

/*function mast_prep_video(set_on_resize) {
    var ratio = $('iframe.video').attr('height') / $('iframe.video').attr('width');
    var width = $('iframe.video').parent().width();
    var height = width * ratio;

    $('iframe.video').attr('width', width).attr('height', height);

    if(set_on_resize) {
        $(window).resize(function() {
            mast_prep_video(false);
        });
    }
}*/

function mast_prompt_lab(cookie) {
    var lab = $('.featured-lab');

    if (document.cookie.indexOf(cookie) < 0) {
        setTimeout(function () {
            lab.addClass('active').find('.yes').click(function () {
                document.location.href = '#currentlab';
                document.cookie = cookie + '=true';
                lab.removeClass('active');
            });

            lab.find('.no').click(function () {
                document.cookie = cookie + '=true';
                lab.removeClass('active');
            });
        }, 1500);
    }
}

/* 
    Yes yes, we're full aware that a savy viewer might see content embargoed in this way. 
    These are informal embargoes, not sensitive. We're unconcerned. And usually, we'll be 
    relying on Jekyll's in-built embargo system anyway.
*/
function mast_lift_embargoes() {
    $('.embargoed').each(
        function (k, v) {
            date = new Date($(v).attr('date')).getTime();
            if (date < Date.now()) {
                $(v).removeClass('embargoed');
            }
        }
    );
}

function mast_prep_playlist_carousel() {
    $('.playlist.owl-carousel').each(function(k, v){
        var carousel = $(v);
        carousel.owlCarousel({
            loop: true,
            items: 5,
            lazyLoad: true,
            margin: 5,
            autoplay: carousel.attr('autoplay') == 'autoplay' ? true : false,
            smartSpeed: 1000,
            dots: false,
            nav: false,
            navSpeed: false,
            responsive: {
                0:      { items: 2 + (parseInt(carousel.attr('extras')) || 0) },
                500:    { items: 5 + (parseInt(carousel.attr('extras')) || 0) },
                1600:   { items: 6 + (parseInt(carousel.attr('extras')) || 0) },
                2000:   { items: 8 + (parseInt(carousel.attr('extras')) || 0) }
            }
        });
        
        var	prev		= $('.carousel_nav a.prev');
        var	next		= $('.carousel_nav a.next');
        
        prev.on('click',function(){
            carousel.trigger('prev.owl.carousel');
            return false;
        });
        next.on('click',function(){
            carousel.trigger('next.owl.carousel');
            return false;
        });
    });
}

$.fn.shuffle = function() {
    var allElems = this.get(),
        getRandom = function(max) {
            return Math.floor(Math.random() * max);
        },
        shuffled = $.map(allElems, function(){
            var random = getRandom(allElems.length),
                randEl = $(allElems[random]).clone(true)[0];
            allElems.splice(random, 1);
            return randEl;
        });
    this.each(function(i){
        $(this).replaceWith($(shuffled[i]));
    });
    return $(shuffled);
};
$('.randomize').shuffle();