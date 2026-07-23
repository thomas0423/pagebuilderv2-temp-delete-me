var $ = jQuery.noConflict();
if (window.location.hostname == "www.affingroup.com") throw new Error("Affingroup will not need this");
if (location.hostname === '' || location.hostname === null || location.href === 'about:blank') throw new Error("Pagebuilder will not need this");

function getServerTime() {
    return $.ajax({async: false}).getResponseHeader('Date');
}

var current = 0;
var current_time = new Date(getServerTime());

//var current_time = new Date();
var current_hour = current_time.getHours();
var current_minute = current_time.getMinutes();
var current_day = current_time.getDay();
//Check browser name and version
var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName = navigator.appName;
var fullVersion = '' + parseFloat(navigator.appVersion);
var majorVersion = parseInt(navigator.appVersion, 10);
var nameOffset, verOffset, ix;

// In Opera 15+, the true version is after "OPR/"
if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 4);
}
// In older Opera, the true version is after "Opera" or after "Version"
else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
}
// In Chrome, the true version is after "Chrome"
else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
}
// In Safari, the true version is after "Safari" or after "Version"
else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
}
// In Firefox, the true version is after "Firefox"
else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
}
// In most other browsers, "name/version" is at the end of userAgent
else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
    (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
    }
}
// trim the fullVersion string at semicolon/space if present
if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

majorVersion = parseInt('' + fullVersion, 10);
if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
}
//document.write
console.log(''
    + 'Browser name  = ' + browserName + '\n'
    + 'Full version  = ' + fullVersion + '\n'
    + 'Major version = ' + majorVersion + '\n'
    + 'navigator.appName = ' + navigator.appName + '\n>'
    + 'navigator.userAgent = ' + navigator.userAgent + '\n'
)


//Check browser
navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

console.log(navigator.sayswho); // outputs: `Chrome 62`
// Opera 8.0+
// var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
})(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
// var isBlink = (isChrome || isOpera) && !!window.CSS;

var output = 'Detecting browsers by ducktyping:\n';
output += 'isIE: ' + isIE + '\n';
output += 'isChrome: ' + isChrome + '\n';
output += 'isFirefox: ' + isFirefox + '\n';
output += 'isSafari: ' + isSafari + '\n';
output += 'isEdge: ' + isEdge + '\n';
// output += 'isBlink: ' + isBlink + '<br>';
console.log(output);

$(document).on("scroll", function () {
    if (window.location.href.indexOf('/bm') != -1) {
        if ($(document).scrollTop() > 20) {
            $("#backtotop2").fadeIn('fast');
        } else {
            $("#backtotop2").fadeOut('fast');
        }
    } else {
        if ($(document).scrollTop() > 20) {
            $("#backtotop").fadeIn('fast');
        } else {
            $("#backtotop").fadeOut('fast');
        }
    }

    if ($(document).scrollTop() > 800) {
        $(".mobile_secondary").addClass("first");
        //$("#secondary_nav_holder").fadeIn('fast', function(){ $("#shrinker").stop().animate({ height: '0' }, 500, function(){ $("#shrinker").fadeOut(); } ); } );
        //$("#shrinker").fadeOut('fast', function () {
        $("#secondary_nav_holder").fadeIn('fast');
        //});

    } else {
        //$("#shrinker").stop().animate({ height: '80' }, 200);
        $(".mobile_secondary").removeClass("first");
        $("#secondary_nav_holder").fadeOut('fast', function () {
            $("#shrinker").fadeIn('fast');
        });
        //$("#secondary_nav_holder").fadeOut('fast', function(){$("#shrinker").stop().animate({ height: '80' }, 500);});
    }
});

$(document).ready(function () {

    var date_array = [
        new Date('2024-01-01'),
        new Date('2024-01-25'),
        new Date('2024-02-10'),
        new Date('2024-02-11'),
        new Date('2024-02-12'),
        new Date('2024-03-28'),
        new Date('2024-04-10'),
        new Date('2024-04-11'),
        new Date('2024-05-01'),
        new Date('2024-05-22'),
        new Date('2024-06-03'),
        new Date('2024-06-17'),
        new Date('2024-07-07'),
        new Date('2024-07-08'),
        new Date('2024-08-31'),
        new Date('2024-09-16'),
        new Date('2024-10-31'),
        new Date('2024-12-25')
    ];
    //console.log(document.getElementById())

    //var d = new Date();

    //console.log('Current Day minused: ', current_day);


    $('body').on('click', ".cx-sidebar", function () {
        //var liId = $(this).parent("li").attr("id");
        //alert('a');
        // Disable scrolling.
        // document.ontouchmove = function (e) {
        //     e.preventDefault();
        // }
        console.log($(window).width());
        var current_time = new Date(getServerTime());
        var current_hour = current_time.getHours();
        var current_minute = current_time.getMinutes();
        var current_day = current_time.getDay();

        setTimeout(
            function () {
                if ($("#assistance_banner").is(".desktop")) {

                } else {
                    //do something special
                    if ($(window).width() < 664) {
                        $('.cx-channel-selector .wrapper').removeAttr('style').css('height', '400px');
                        $('.cx-channel-selector .cx-channels .cx-channel').css({'border': 'none', 'width': '48%'});
                        $('.cx-channel .cx-icon').removeAttr('style').css({'display': 'block'})
                        $('.cx-channel-selector-overlay-mobile .ark.cx-common-container.control-cx-channel-selector .cx-body .cx-channel-selector .cx-channels .cx-channel .channel-details').css('width', '100%');
                        $('.cx-channel-selector-overlay-mobile .ark.cx-common-container.control-cx-channel-selector .cx-body .cx-channel-selector .wrapper').css('height', '400px');
                        //$('.Channel02 .channel-details').css({'padding-top':'32px'});
                    } else {
                        $('.cx-channel .cx-icon').removeAttr('style').css({'display': 'block', 'height': '95px'});
                        $('.cx-channel-selector .cx-channels .cx-channel').css({'border': 'none', 'width': '24%'});
                    }

                    $('.ark.cx-common-container.control-cx-channel-selector .cx-body').css({'background-color': '#7FCBFF'}).append('<div class="banner_" style="display:none;"><div class="black_bar"><div class="black_bar_title"><img class="black_bar_icon" src="/img/faq.gif"/> Affin Chat</div></div><img class="mobile" src="/img/affin-always-live-chat/affin-always-chat-backgroung.png"/><img id="assistance_banner" class="desktop" src="/img/affin-always-live-chat/affin-always-chat-backgroung.png"/></div>');
                    $('.Channel00 .cx-icon').empty().append($('<p>').text('You can instantly contact us through live chat'));
                    $('.Channel00 .channel-details').append($('<button>').attr({
                        'type': 'button',
                        'class': 'btn w-100'
                    }).css({
                        'padding-top': '12px',
                        'padding-bottom': '12px',
                        'background': '#0768B3',
                        'color': '#fff',
                        'border-radius': '10px',
                        'border': 'none'
                    }).text('Chat Now'))
                    $('.Channel01 .cx-icon').empty().append($('<p>').text('Call us from everywhere and any device, efficiently.'));
                    $('.Channel01 .channel-details').append($('<button>').attr({
                        'type': 'button',
                        'class': 'btn w-100'
                    }).css({
                        'padding-top': '12px',
                        'padding-bottom': '12px',
                        'background': '#0768B3',
                        'color': '#fff',
                        'border-radius': '10px',
                        'border': 'none'
                    }).text('Call Now'));
                    $('.Channel02 .cx-icon').empty().append($('<p>').text('Just set a time and we will reach you at your convenient time.'));
                    $('.Channel02 .channel-details').append($('<button>').attr({
                        'type': 'button',
                        'class': 'btn w-100'
                    }).css({
                        'padding-top': '12px',
                        'padding-bottom': '12px',
                        'background': '#0768B3',
                        'color': '#fff',
                        'border-radius': '10px',
                        'border': 'none'
                    }).text('Schedule Now'));
                    $('.Channel03 .cx-icon').empty().append($('<p>').text("Got a question? Send us an email and we'll get an answer for you as soon as possible."));
                    $('.Channel03 .channel-details').append($('<button>').attr({
                        'type': 'button',
                        'class': 'btn w-100'
                    }).css({
                        'padding-top': '12px',
                        'padding-bottom': '12px',
                        'background': '#0768B3',
                        'color': '#fff',
                        'border-radius': '10px',
                        'border': 'none'
                    }).text('Email Now'));

                    $(".cx-channel.Channel00 .name.i18n").detach().prependTo(".cx-channel.Channel00");
                    $(".cx-channel.Channel01 .name.i18n").detach().prependTo(".cx-channel.Channel01");
                    $(".cx-channel.Channel02 .name.i18n").detach().prependTo(".cx-channel.Channel02");
                    $(".cx-channel.Channel03 .name.i18n").detach().prependTo(".cx-channel.Channel03");
                    $('.message.i18n').innerText = '';

                    $('.cx-channel-selector .wrapper').css({'width': '100%', 'font-family': 'sans-serif'});

                    $('.cx-channel-selector .cx-channels .cx-channel .name').css({
                        'color': 'black',
                        'font-size': '24px'
                    });
                    $('.cx-common-container.cx-close .cx-buttons-window-control button.cx-button-close').css('color', '#fff');
                    $('.cx-channel-selector .cx-channels .cx-channel .availability').css('padding', '0');
                    //$('.Channel00 .cx-icon, .Channel01 .cx-icon, .Channel02 .cx-icon').height($('.Channel03 .cx-icon').height());
                    $('.cx-channel-selector .cx-channels .cx-channel .cx-icon').append($('<button>').addClass('btn btn-primary').text());
                    $('.banner_').fadeIn();
                    $('.cx-channel-selector .cx-channels .cx-channel .name').fadeIn();
                    $('.cx-channel-selector .cx-channels .cx-channel .cx-icon').fadeIn();
                    $('.cx-common-container.cx-overlay .cx-footer').css('padding', '0');


                    //  $(".ga_emedic").click( function() {
                    //console.log("CLICKED YEAHHHHHHH AFFINCONNECT MENU");
                    /*gtag('event', 'click', {
                      'event_category': 'Homepage',
                      'event_label': 'Loan_Banner',
                      'value': window.location.href
                  });*/
                    //security_not("promotions#axaemediccamp").dialog({ modal: true });
                    //window.open("promotions#axaemediccamp", '_blank');
                    //$(this).dialog({ modal: true });
                    // });

                    $(".ga_emedic").click(function () {
                        //console.log("CLICKED YEAHHHHHHH AFFINCONNECT MENU");
                        gtag('event', 'click', {
                            'event_category': 'eMedic2019',
                            'event_label': 'AffinConnect Menu',
                            'value': window.location.href
                        });
                        //security_not("https://www.axa.com.my/buy/online-medical-card-malaysia/affin-bank/purchase?id=mC8ofUcjfQ").dialog({ modal: true });
                        window.open("promotions#axaemediccamp", '_blank');
                        $(this).dialog({modal: true});
                    });
                }

                $('.cx-widget').on('click', ".cx-common-container.cx-close .cx-buttons-window-control button.cx-button-close", function () {
                    //$("html").css({'overflow':'visible'});
                    $(".lock").css({'overflow': 'visible'});
                });

                //Check Day & Time for Live Chat
                //Check Day for Live Chat if Sat or Sun
                if ((current_day == 6) || (current_day == 0)) {
                    $('.cx-channel.Channel00').css('opacity', 0.5);
                    $('.cx-channel.Channel00').css('pointer-events', "none");
                    //$('.cx-channel.Channel00').css('opacity', 1.0);
                    //$('.cx-channel.Channel00').css('pointer-events', "auto");

                } else {

                    //Correct time is 9am to 6pm
                    if ((current_hour >= 9) && (current_hour < 18)) {
                        $('.cx-channel.Channel00').css('opacity', 1.0);
                        $('.cx-channel.Channel00').css('pointer-events', "auto");
                    } else {
                        $('.cx-channel.Channel00').css('opacity', 0.5);
                        $('.cx-channel.Channel00').css('pointer-events', "none");
                        //$('.cx-channel.Channel00').css('opacity', 1.0);
                        //$('.cx-channel.Channel00').css('pointer-events', "auto");
                    }

                    for (let x in date_array) {
                        //alert(date_array[x]);
                        if ((current_time.getDate() === date_array[x].getDate()) &&
                            (current_time.getMonth() === date_array[x].getMonth()) &&
                            (current_time.getFullYear() === date_array[x].getFullYear())) {
                            //Check if it's a holiday listed in the array of dates above
                            //If yes, disable the prompts
                            console.log('today is a holiday, live chat is disabled');
                            $('.cx-channel.Channel00').css('opacity', 0.5);
                            $('.cx-channel.Channel00').css('pointer-events', "none");
                        }
                    }
                }

                //Check time for Call Us
                //8AM to 12AM EVERYDAY
                if ((current_hour >= 8) && (current_hour < 24)) {
                    $('.cx-channel.Channel01').css('opacity', 1.0);
                    $('.cx-channel.Channel01').css('pointer-events', "auto");
                } else {
                    $('.cx-channel.Channel01').css('opacity', 0.5);
                    $('.cx-channel.Channel01').css('pointer-events', "none");
                    //$('.cx-channel.Channel00').css('opacity', 1.0);
                    //$('.cx-channel.Channel00').css('pointer-events', "auto");
                }

                //Check time for Schedule a Call
                //9AM to 9PM EVERYDAY
                if ((current_hour >= 9) && (current_hour < 21)) {
                    $('.cx-channel.Channel02').css('opacity', 1.0);
                    $('.cx-channel.Channel02').css('pointer-events', "auto");
                } else {
                    $('.cx-channel.Channel02').css('opacity', 0.5);
                    $('.cx-channel.Channel02').css('pointer-events', "none");
                    //$('.cx-channel.Channel02').css('opacity', 1.0);
                    //$('.cx-channel.Channel02').css('pointer-events', "auto");
                }

                $('.Channel00').on('click', ".cx-icon", function () {

                    document.cookie = "chat_trigger=triggered";
                    clearInterval(idleInterval);
                    clearTimeout(initiate_active);

                    /*gtag('event', 'click', {
                        'event_category': 'AFFINConnect',
                        'event_label': 'Live Chat',
                        'value': window.location.href
                    });*/
                    //stopTheFunction();
                    //stopTheFunction2();

                    setTimeout(
                        function () {

                            //if ( $( "#chat_icon" ).is( ".fa-comment" ) ) {
                            if ($("#chat_icon").is(".new_chat_icon")) {
                                //$( ".cx-title.i18n" ).remove( "#chat_icon" );
                                $(".cx-title.i18n").remove(".new_chat_icon");

                            } else {
                                // $('.cx-common-container .cx-titlebar').css('background','linear-gradient(89.98deg, #0768B3 0.01%, #8607B3 99.99%)');
                                //$('.ark.cx-common-container.cx-webchat .cx-titlebar .cx-title').prepend('<i id="chat_icon" class="fa fa-comment" aria-hidden="true"></i> ');
                                $('.ark.cx-common-container.cx-webchat > .cx-titlebar > .cx-title').prepend('<img src="/img/live_chat_icon_trans.png" style="width: 40px;height: auto;" id="chat_icon" class="new_chat_icon"> ');
                                //$('.ark.cx-common-container.cx-webchat > .cx-body').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;" id="emedic_banner" class="desktop"></a>');
                                $('.ark.cx-common-container.cx-webchat').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;position: absolute;bottom: 40px;" id="emedic_banner" class="mobile"></a> ');
                                //$('.ark.cx-common-container.cx-webchat > .cx-titlebar > .cx-title').remove('img');
                                //$(".submit.btn.btn-primary.i18n").trigger("click");
                                //$("#emedic_banner").click( function() {
                                /*gtag('event', 'click', {
                                  'event_category': 'Homepage',
                                  'event_label': 'Loan_Banner',
                                  'value': window.location.href
                              });*/
                                //security_not("promotions#axaemediccamp").dialog({ modal: true });
                                // window.open("promotions#axaemediccamp", '_blank');
                                // $(this).dialog({ modal: true });
                                //});
                                $("#emedic_banner,#emedic_banner2").click(function () {
                                    gtag('event', 'click', {
                                        'event_category': 'eMedic2019',
                                        'event_label': 'Chat Banner',
                                        'value': window.location.href
                                    });
                                    //security_not("https://www.axa.com.my/buy/online-medical-card-malaysia/affin-bank/purchase?id=mC8ofUcjfQ").dialog({ modal: true });
                                    window.open("promotions#axaemediccamp", '_blank');
                                    $(this).dialog({modal: true});
                                });
                            }


                            $('.cx-widget').on('click', ".cx-widget.cx-theme-light button.btn.btn-default", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });

                            $('.cx-widget').on('click', ".cx-common-container.cx-minimize .cx-buttons-window-control button.cx-button-minimize", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });

                            $(".cx-webchat button.submit.btn.btn-primary.i18n").click(function () {

                                if ($('#cx_webchat_form_firstname').val() != "") {
                                    gtag('event', 'click', {
                                        'event_category': 'AFFINConnect',
                                        'event_label': "Live Chat - Let's Chat",
                                        'value': window.location.href
                                    });

                                    setTimeout(
                                        function () {


                                            //Check if IE
                                            if (isIE) {
                                                //supported so check version
                                                //check version
                                                if (navigator.sayswho == "IE 11") {
                                                    console.log("IE version is supported!");
                                                    //enable the option
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'inherit');
                                                }
                                            }
                                            if (isEdge) {
                                                //supported
                                                //enable the option
                                                console.log("Your Edge is good!");
                                                $('.cx-tooltip-menu.actions ').css('visibility', 'inherit');
                                            }
                                            if (isChrome) {
                                                //supported so check version
                                                //check version
                                                //console.log(getChromeVersion());
                                                if (majorVersion >= 47) {
                                                    console.log("Chrome version 47 and above is supported!");
                                                    //enable the option
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'inherit');
                                                } else {
                                                    console.log("Your chrome is outdated!");
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'hidden');
                                                }
                                            }
                                            if (isFirefox) {
                                                //supported so check version
                                                //check version
                                                if (majorVersion >= 43) {
                                                    console.log("Firefox version 43 and above is supported!");
                                                    //enable the option
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'inherit');
                                                } else {
                                                    console.log("Your Firefox is outdated!");
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'hidden');
                                                }
                                            }
                                            if (isSafari) {
                                                //supported so check version
                                                //check version
                                                if (majorVersion >= 8) {
                                                    console.log("Safari version 8 and above is supported!");
                                                    //enable the option
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'inherit');
                                                } else {
                                                    console.log("Your Safari is outdated!");
                                                    $('.cx-tooltip-menu.actions ').css('visibility', 'hidden');
                                                }
                                            }
                                            //li.option.cobrowse.disabled.i18n
                                            //if($( ".option.cobrowse.i18n" ).hasClass( "disabled" )){

                                            //}
                                            $('.option.cobrowse.i18n').on('click', function () {
                                                if ($("li.option.cobrowse.i18n").hasClass("disabled")) {

                                                } else {
                                                    gtag('event', 'click', {
                                                        'event_category': 'Live Chat Co-Browse',
                                                        'event_label': "Start Co-Browse",
                                                        'value': window.location.href
                                                    });
                                                    setTimeout(function () {
                                                        if ($(".option.cobrowse.i18n").text() == "Exit Co-browse") {
                                                            gtag('event', 'click', {
                                                                'event_category': 'Live Chat Co-Browse',
                                                                'event_label': "Exit Co-Browse",
                                                                'value': window.location.href
                                                            });
                                                        }
                                                    }, 1000);


                                                }
                                            });

                                            $('.cx-widget.cx-webchat .cx-button-close.icon-close').on('click', function () {

                                                $(".cx-webchat button.end-confirm.btn.btn-primary.i18n").click(function () {
                                                    gtag('event', 'click', {
                                                        'event_category': 'AFFINConnect',
                                                        'event_label': "Live Chat - End Chat",
                                                        'value': window.location.href
                                                    });
                                                });

                                            });


                                        }, 1000);


                                }


                            });

                        }
                        , 1000);

                });

                $('.Channel01').on('click', function () {

                    //$("html").css({'overflow':'hidden'});
                    //$("body").css({'overflow':'hidden'});

                    /*gtag('event', 'click', {
                        'event_category': 'AFFINConnect',
                        'event_label': 'Call Us Now',
                        'value': window.location.href
                    });*/

                    setTimeout(
                        () => {

                            if ($("#call_us_banner").is(".desktop")) {

                            } else {

                                $('.cx-common-container.cx-overlay .cx-body').prepend(
                                    $('<div>').addClass('banner_').css('display', 'none').append(
                                        $('<div>').addClass('black_bar').append(
                                            $('<div>').addClass('black_bar_title').text('Call us Now').append(
                                                $('<img>').attr('src', '/img/faq.gif').addClass('black_bar_icon')
                                            )
                                        ),
                                        $('<img>').attr({
                                            'src': '/img/affin-always-live-chat/Call-us-now 2.png',
                                            'class': 'desktop',
                                            'id': 'call_us_banner'
                                        }),
                                        $('<img>').attr({
                                            'src': '/img/affin-always-live-chat/Call-us-now 2.png',
                                            'class': 'mobile'
                                        }),
                                        $('<p>').addClass('mb-0').css({
                                            'font-size': '35px',
                                            'position': 'absolute',
                                            'top': '-2px',
                                            'right': '55px'
                                        }).text('Call us now')
                                    )
                                )
                                $('.banner_').fadeIn();

                            }

                            //$('.cx-callback .callback-header-container .title-description').text('Feel free to call us for any enquiries via the contact number below.');
                            $('.cx-call-us .contacts-header-container').empty().append(
                                $('<div>').attr({'class': 'i18n contacts-header', 'data-message': 'ContactsHeader'})
                                    .text('Feel free to call us for any enquiries via the contact number below'),
                            );
                            $('.cx-call-us .cx-content').empty().append(
                                $('<div>').addClass('cx-wrapper').append(
                                    $('<div>').addClass('cx-main-phone').append(
                                        $('<div>').append(
                                            $('<div>').addClass('cx-phone-title').append(
                                                $('<span>').addClass('i18n').css('font-size', '306x').text('Contact Center')
                                            ),
                                            $('<div>').addClass('cx-phone-number').append(
                                                $('<i>').attr({'class': 'fa fa-phone', 'aria-hidden': 'true'}),
                                                $('<span>').addClass('i18n ga-call-us-phone').css('font-size', '306x').append(
                                                    $('<a>').attr('href', 'tel:+603-82302222').text('+603-8230 2222')
                                                )
                                            )
                                        )
                                    ),
                                    $('<div>').addClass('hahaha').append(
                                        $('<div>').addClass('cx-availability').append(
                                            $('<div>').addClass('cx-hours').append(
                                                $('<div>').addClass('i18n').text('Mon - Sun'),
                                                $('<div>').addClass('i18n').append(
                                                    $('<b>').text('8:00 am - 12:00 am')
                                                ),
                                            ),
                                            $('<div>').addClass('cx-ewt').text('Available')
                                        )
                                    )
                                )
                            );


                            $('.cx-widget').on('click', ".cx-common-container.cx-close .cx-buttons-window-control button.cx-button-close", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });

                            $('.cx-widget').on('click', ".cx-widget.cx-theme-light button.btn.btn-default", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });

                            //$(".ga-call-us-phone").click( function() {
                            $("i.fa.fa-phone").click(function (e) {
                                //e.preventDefault();
                                //var href= $(this).attr('href');

                                var href = "tel:+603-82302222";
                                //alert(href);
                                gtag('event', 'click', {
                                    'event_category': 'AFFINConnect',
                                    'event_label': "Call Us Now - Number",
                                    'value': window.location.href
                                });
                                //setTimeout(function(){ window.location=href; }, 5000);
                                window.location = href;
                                //return false;
                            });

                        }
                        , 1000);

                });


                $('.Channel02').on('click', ".cx-icon", function () {
                    /*gtag('event', 'click', {
                        'event_category': 'AFFINConnect',
                        'event_label': 'Schedule a Call',
                        'value': window.location.href
                    });*/
                    setTimeout(
                        function () {

                            if ($("#call_us_banner").is(".desktop")) {

                            } else {
                                //$('.cx-common-container.cx-overlay .cx-body').prepend('<div class="banner_" style="display:none;"><div class="black_bar"><div class="black_bar_title"><img class="black_bar_icon" src="/img/affin-always-live-chat/Call-us-now 3.png"/> Schedule a Call</div></div><img id="call_in_banner" src="/img/affin-always-live-chat/Call-us-now 3.png" class="desktop"/><img src="/img/affin-always-live-chat/Call-us-now 3.png" class="mobile" style="display:none;"/></div>');
                                $('.cx-common-container.cx-overlay .cx-body').prepend(
                                    $('<div>').addClass('banner_').css({'display': 'none'}).append(
                                        $('<div>').addClass('black_bar').append(
                                            $('<div>').addClass('black_bar_title').text('Call us Now').append(
                                                $('<img>').attr('src', '/img/faq.gif').addClass('black_bar_icon')
                                            )
                                        ),
                                        $('<img>').attr({
                                            'src': '/img/affin-always-live-chat/Call-us-now 3.png',
                                            'class': 'desktop',
                                            'id': 'call_us_banner'
                                        }),
                                        $('<img>').attr({
                                            'src': '/img/affin-always-live-chat/Call-us-now 3.png',
                                            'class': 'mobile'
                                        }),
                                        $('<p>').addClass('mb-0').css({
                                            'font-size': '35px',
                                            'position': 'absolute',
                                            'top': '-2px',
                                            'right': '55px'
                                        }).text('Schedule a Call')
                                    )
                                )
                                $('.banner_').fadeIn();
                            }
                            $('.cx-callback .callback-header-container .title-description').text('We would like to know more about you. Please fill in your details.');
                            $('.cx-callback').css('font-size', '15px');
                            $('.cx-callback .callback-header-container .today-date').css('font-size', '15px');

                            $('.cx-widget').on('click', ".cx-common-container.cx-close .cx-buttons-window-control button.cx-button-close", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });
                            $('.cx-widget').on('click', ".cx-callback-cancel", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });

                            $('.cx-mobile input#cx_form_callback_time').on('click', function () {
                                $('body').css('position', 'fixed');
                                $('.cx-widget.ark.cx-common-container.cx-overlay.cx-close.cx-theme-light.cx-callback-container.cx-mobile.cx-portrait > .cx-body').css('position', 'fixed');
                                setInterval(
                                    function () {
                                        if ($(".calendar-container").css("height") == "0px") {
                                            $('body').css('position', 'static');
                                            $('.cx-widget.ark.cx-common-container.cx-overlay.cx-close.cx-theme-light.cx-callback-container.cx-mobile.cx-portrait > .cx-body').css('position', 'relative');
                                        } else if ($(".cx-mobile .cx-calendar .cx-calendar-header").css("background-color") == "rgb(238, 238, 238)") {
                                            $('body').css('position', 'fixed');
                                            $('.cx-widget.ark.cx-common-container.cx-overlay.cx-close.cx-theme-light.cx-callback-container.cx-mobile.cx-portrait > .cx-body').css('position', 'fixed');
                                        } else {
                                            $('body').css('position', 'static');
                                            $('.cx-widget.ark.cx-common-container.cx-overlay.cx-close.cx-theme-light.cx-callback-container.cx-mobile.cx-portrait > .cx-body').css('position', 'relative');
                                        }
                                    }, 1000);
                            });

                            $('.i18n.btn.btn-default.cx-callback-cancel').on('click', function () {

                                setTimeout(function () {
                                    if ($(".error-container.warning-container").css("display") == "block") {
                                        setTimeout(function () {
                                            $(".cx-widget.cx-callback-container .cx-buttons-binary .failed-retry.btn.btn-primary").on('click', function () {

                                                gtag('event', 'click', {
                                                    'event_category': 'AFFINConnect',
                                                    'event_label': "Schedule a Call - Cancel (Yes)",
                                                    'value': window.location.href
                                                });

                                            });
                                        }, 100);
                                    } else {
                                        //if(($('#cx_form_callback_firstname').val() == "") &&($('#cx_form_callback_lastname').val() == "") && ($('#cx_form_callback_phone_number').val() == "") && ($('#cx_form_callback_email').val() == "") && ($('#cx_form_callback_time').val() == ""))
                                        gtag('event', 'click', {
                                            'event_category': 'AFFINConnect',
                                            'event_label': 'Schedule a Call - Cancel',
                                            'value': window.location.href
                                        });

                                    }
                                }, 100);
                            });
                            //.cx-callback-container .cx-button-close.icon-close
                            $('.cx-full-screen-view .cx-common-container.cx-overlay.cx-mobile .cx-button-close.icon-close').on('click', function () {

                                //if(($('#cx_form_callback_firstname').val() != "") ||($('#cx_form_callback_lastname').val() != "") || ($('#cx_form_callback_phone_number').val() != "") || ($('#cx_form_callback_email').val() != "") ||($('#cx_form_callback_time').val() != "")) {
                                //error-container warning-container
                                setTimeout(function () {
                                    //alert($(".error-container.warning-container").css("display"));
                                    if ($(".error-container.warning-container").css("display") == "block") {
                                        $(".cx-callback-container.cx-mobile button.failed-retry.btn.btn-primary.i18n").on('click', function () {
                                            //setTimeout(function(){
                                            gtag('event', 'click', {
                                                'event_category': 'AFFINConnect',
                                                'event_label': "Schedule a Call - Cancel (Yes)",
                                                'value': window.location.href
                                            });
                                            //}, 100);
                                        });

                                    } else {

                                        gtag('event', 'click', {
                                            'event_category': 'AFFINConnect',
                                            'event_label': 'Schedule a Call - Cancel',
                                            'value': window.location.href
                                        });

                                    }
                                }, 100);

                            });

                            $('.cx-callback-container .cx-button-close.icon-close').on('click', function () {

                                //if(($('#cx_form_callback_firstname').val() != "") ||($('#cx_form_callback_lastname').val() != "") || ($('#cx_form_callback_phone_number').val() != "") || ($('#cx_form_callback_email').val() != "") ||($('#cx_form_callback_time').val() != "")) {
                                setTimeout(function () {
                                    if ($(".error-container.warning-container").css("display") == "block") {
                                        $(".cx-widget .cx-callback-container .cx-buttons-binary .failed-retry.btn.btn-primary").on('click', function () {
                                            //setTimeout(function(){
                                            gtag('event', 'click', {
                                                'event_category': 'AFFINConnect',
                                                'event_label': "Schedule a Call - Cancel (Yes)",
                                                'value': window.location.href
                                            });
                                            //}, 100);
                                        });

                                    } else if (($('#cx_form_callback_firstname').val() == "") && ($('#cx_form_callback_lastname').val() == "") && ($('#cx_form_callback_phone_number').val() == "") && ($('#cx_form_callback_email').val() == "") && ($('#cx_form_callback_time').val() == "")) {

                                        gtag('event', 'click', {
                                            'event_category': 'AFFINConnect',
                                            'event_label': 'Schedule a Call - Cancel',
                                            'value': window.location.href
                                        });

                                    }
                                }, 100);

                            });

                            //$('.cx-button-group.cx-buttons-binary').on('click', ".i18n.btn.btn-primary.cx-callback-confirm", function() {
                            //if($('#cx_form_callback_time').val() != ""){

                            $('.i18n.btn.btn-primary.cx-callback-confirm').on('click', function () {
                                //alert($('#cx_form_callback_time').val());
                                //if($('#cx_form_callback_time').val() == ""){
                                //  return false;
                                // }
                                $('.cx-callback .fail-message').css("visibility", "hidden");
                                setTimeout(function () {

                                    if ($('.cx-callback .fail-message').text() == "Bad Parameter _desired_time: Date string 'on' is not parseable as ISO 8601 timestamp") {

                                        $('.cx-callback .fail-message').text("Please Select a Date & Time");
                                        //$('.cx-callback .fail-message').css("visibility", "visible");
                                        $('.cx-callback .fail-message').fadeIn();
                                    } else {
                                        $('.cx-callback .fail-message').fadeIn();
                                    }
                                }, 100);

                                setTimeout(function () {

                                    if ($('.cx-mobile .cx-callback .fail-message').text() == "Bad Parameter _desired_time: Date string 'on' is not parseable as ISO 8601 timestamp") {

                                        $('.cx-mobile .cx-callback .fail-message').text("Please Select a Date & Time");
                                        //$('.cx-callback .fail-message').css("visibility", "visible");
                                        $('.cx-mobile .cx-callback .fail-message').fadeIn();
                                    } else {
                                        $('.cx-mobile .cx-callback .fail-message').fadeIn();
                                    }
                                }, 450);

                                //if connection successful
                                setTimeout(
                                    function () {

                                        if ($(".cx-callback .spinner ").css("display") == "block") {
                                            $('.cx-common-container.cx-overlay').addClass("disable");
                                        } else {
                                            $('.cx-common-container.cx-overlay').removeClass("disable");
                                        }
                                        if ($(".cx-callback .error-container ").css("display") == "none") {
                                            $('.cx-common-container.cx-overlay').removeClass("disable");
                                        } else {
                                            $('.cx-common-container.cx-overlay').addClass("disable");
                                        }
                                        if (($('#cx_form_callback_firstname').val() != "") && ($('#cx_form_callback_lastname').val() != "") && ($('#cx_form_callback_phone_number').val() != "") && ($('#cx_form_callback_email').val() != "") && ($('#cx_form_callback_time').val() != "")) {

                                            gtag('event', 'click', {
                                                'event_category': 'AFFINConnect',
                                                'event_label': 'Schedule a Call - Confirm',
                                                'value': window.location.href
                                            });


                                        }

                                    }, 500);

                                //if connection error
                                setTimeout(
                                    function () {

                                        $('.failed-retry.btn.btn-primary.i18n').on('click', function () {
                                            //$(".cx-callback .callback-header-container").css("opacity", "1.0");
                                            $('.cx-common-container.cx-overlay').removeClass("disable");
                                        });


                                    }, 1000);


                            });
                            // }


                        }
                        , 1000);
                });


                $('.Channel03').on('click', function (e) {
                    /*gtag('event', 'click', {
                        'event_category': 'AFFINConnect',
                        'event_label': 'Email Us',
                        'value': window.location.href
                    });*/
                    var mailto_email = 'yourvoice@affinbank.com.my';
                    //var mailto_email = 'uatccq@affinbank.com.my';

                    var mailto_subject = 'AffinConnect%20Email%20Us';
                    //var mailto_emailBody = 'This is a test template.';
                    //window.location = 'mailto:' + mailto_email + '?subject=' + mailto_subject + '&body=' +   mailto_emailBody;
                    window.location.href = 'mailto:' + mailto_email + '?subject=' + mailto_subject;
                    setTimeout(
                        function () {
                            $("button.cx-button-close.icon-close").click();
                            //if ( $( "#chat_icon" ).is( ".fa-comment" ) ) {

                            //}else{
                            //$('.ark.cx-common-container.cx-webchat .cx-titlebar .cx-title').prepend('<i id="chat_icon" class="fa fa-comment" aria-hidden="true"></i> ');
                            //}
                            /*$('.cx-widget').on('click', ".cx-widget.cx-theme-light button.btn.btn-default", function() {
                                $("html").css({'overflow':'visible'});
                                $("body").css({'overflow':'visible'});
                            });*/

                            $('.cx-widget').on('click', ".ark.cx-common-container.control-cx-send-message .cx-buttons-window-control button.cx-button-minimize", function () {
                                $(".lock").css({'overflow': 'visible'});
                            });


                            $('.cx-send-message .right-half .btn.btn-primary.submit.i18n').on('click', function () {
                                if (($('#cx_sendmessage_form_firstname').val() != "") && ($('#cx_sendmessage_form_lastname').val() != "") && ($('#cx_sendmessage_form_email').val() != "") && ($('#cx_sendmessage_form_subject').val() != "") && ($('#cx_sendmessage_form_messagebody').val() != "")) {
                                    $('#cx_sendmessage_form_subject').val('[WebForm] ' + $('#cx_sendmessage_form_subject').val());
                                    gtag('event', 'click', {
                                        'event_category': 'AFFINConnect',
                                        'event_label': 'Email Us - Send',
                                        'value': window.location.href
                                    });
                                }
                            });

                            $('.control-cx-send-message .cx-button-close.icon-close').on('click', function () {

                                if (($('#cx_sendmessage_form_firstname').val() != "") || ($('#cx_sendmessage_form_lastname').val() != "") || ($('#cx_sendmessage_form_email').val() != "") || ($('#cx_sendmessage_form_subject').val() != "") || ($('#cx_sendmessage_form_messagebody').val() != "")) {

                                    $(".cx-send-message .end-confirm.btn.btn-primary.i18n").click(function () {
                                        gtag('event', 'click', {
                                            'event_category': 'AFFINConnect',
                                            'event_label': "Email Us - Cancel (Yes)",
                                            'value': window.location.href
                                        });
                                    });

                                } else {
                                    gtag('event', 'click', {
                                        'event_category': 'AFFINConnect',
                                        'event_label': "Email Us - Cancel",
                                        'value': window.location.href
                                    });

                                }

                            });
                        }
                        , 1000);
                });

            },
            1000);
    });

    $('div.capt2').fadeIn(1000);


    /* GA TAGS */
    $(".business_login").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Login',
            'event_label': 'Business',
            'value': window.location.href
        })
    });

    $(".personal_login").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Login',
            'event_label': 'Personal',
            'value': window.location.href
        })
    });

    $(".hamburger_affin_bank").click(function () {
        gtag('event', 'click', {
            'event_category': 'Affin_Group',
            'event_label': 'Affin_Bank_Berhad',
            'value': window.location.href
        });
    });

    $(".hamburger_affin_islamic").click(function () {
        gtag('event', 'click', {
            'event_category': 'Affin_Group',
            'event_label': 'Affin_Islamic_Bank',
            'value': window.location.href
        });
    });

    $(".hamburger_affin_holding").click(function () {
        gtag('event', 'click', {
            'event_category': 'Affin_Group',
            'event_label': 'Affin_Holding',
            'value': window.location.href
        });
    });

    $(".hamburger_affin_hwang").click(function () {
        gtag('event', 'click', {
            'event_category': 'Affin_Group',
            'event_label': 'Affin_Hwang',
            'value': window.location.href
        });
    });

    $(".hamburger_affin_share").click(function () {
        gtag('event', 'click', {
            'event_category': 'Affin_Group',
            'event_label': 'Affin_Share',
            'value': window.location.href
        });
    });

    $(".hamburger_save").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Save',
            'value': window.location.href
        });
    });

    $(".hamburger_spend").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Spend',
            'value': window.location.href
        });
    });

    $(".hamburger_protect").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Protect',


            'value': window.location.href
        });
    });

    $(".hamburger_loan").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Loan',
            'value': window.location.href
        });
    });

    $(".hamburger_invest").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Invest',
            'value': window.location.href
        });
    });

    $(".hamburger_quick_banking").click(function () {
        gtag('event', 'click', {
            'event_category': 'Hamburger_Menu',
            'event_label': 'Quick_Banking',
            'value': window.location.href
        });
    });

    $(".ga_facebook").click(function () {
        gtag('event', 'click', {
            'event_category': 'Social_Media',
            'event_label': 'Facebook',
            'value': window.location.href
        });
    });

    $(".ga_youtube").click(function () {
        gtag('event', 'click', {
            'event_category': 'Social_Media',
            'event_label': 'Youtube',
            'value': window.location.href
        });
    });

    $(".ga_twitter").click(function () {
        gtag('event', 'click', {
            'event_category': 'Social_Media',
            'event_label': 'Twitter',
            'value': window.location.href
        });
    });

    $(".islamic_homepage").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Outbound_Islamic',
            'event_label': 'Islamic_Homepage',
            'value': window.location.href
        });
    });

    $(".islamic_save").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Outbound_Islamic',
            'event_label': 'Islamic_Save',
            'value': window.location.href
        });
    });

    $(".islamic_spend").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Outbound_Islamic',
            'event_label': 'Islamic_Spend',
            'value': window.location.href
        });
    });

    $(".islamic_loan").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Outbound_Islamic',
            'event_label': 'Islamic_Loan',
            'value': window.location.href
        });
    });

    $(".islamic_protect").click(function () {
        gtag('event', 'Click', {
            'event_category': 'Outbound_Islamic',
            'event_label': 'Islamic_Protect',
            'value': window.location.href
        });
    });

    $(".btn-4_save").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Save_Banner',
            'value': window.location.href
        });
    });

    $(".btn-4_spend").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Spend_Banner',
            'value': window.location.href
        });
    });

    $(".btn-4_loan").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Loan_Banner',
            'value': window.location.href
        });
    });

    $(".btn-4_invest").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Invest_Banner',
            'value': window.location.href
        });
    });


    $(".btn-4_protect").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Protect_Banner',
            'value': window.location.href
        });
    });

    $(".btn-4_quickbanking").click(function () {
        gtag('event', 'click', {
            'event_category': 'Homepage',
            'event_label': 'Quick_banking_Banner',
            'value': window.location.href
        });
    });

    $(".ga_announcement").click(function () {
        gtag('event', 'click', {
            'event_category': 'Announcement',
            'event_label': $(this).closest(".ga_announcement").find('h4').text(),
            'value': window.location.href
        });
    });


    $(".ga_promotion").click(function () {
        gtag('event', 'click', {
            'event_category': 'Promotion',
            'event_label': $(this).closest(".ga_promotion").find('h4').text(),
            'value': window.location.href
        });
    });

    $(".ga_security").click(function () {
        gtag('event', 'click', {
            'event_category': 'Security_Awareness',
            'event_label': $(this).closest(".ga_security").find('h4').text(),
            //'event_label': $(this).closest( "h4" ).text(),
            'value': window.location.href
        });
    });

    $(".ga_highlights").click(function () {
        gtag('event', 'click', {
            'event_category': 'Highlights',
            'event_label': $(this).closest(".ga_highlights").find('p').text(),
            'value': window.location.href
        });
    });


    $(".ga_promotion_card").click(function () {
        gtag('event', 'click', {
            'event_category': 'Promotion_card',
            'event_label': $(this).closest(".ga_promotion_card").find('h4').text(),
            //'event_label': $(this).closest( "h4" ).text(),
            'value': window.location.href
        });
    });

    $(".ga-affin-connect-icon").click(function () {
        gtag('event', 'click', {
            'event_category': 'AFFINConnect',
            'event_label': 'AFFINConnect Menu',
            'value': window.location.href
        });
    });


    if (screen.width < 1024) {
        setTimeout(function () {
            $(".cx-sidebar-button").on('click', function () {
                //alert(screen.width);
                /*gtag('event', 'click', {
                    'event_category': 'AFFINConnect',
                    'event_label': 'AFFINConnect Menu Mobile',
                    'value': window.location.href
                });*/


            });
        }, 500);
    }


    setTimeout(function () {
        $(".cx-mobile > .cx-sidebar-button").on('click', function () {

            //alert(screen.width);
            /*gtag('event', 'click', {
                'event_category': 'AFFINConnect',
                'event_label': 'AFFINConnect Menu Mobile',
                'value': window.location.href
            });*/

        });
    }, 200);

    $(".cx-webchat button.submit.btn.btn-primary.i18n").click(function () {
        gtag('event', 'click', {
            'event_category': 'AFFINConnect',
            'event_label': "Live Chat - Let's Chat",
            'value': window.location.href
        });
    });
    $(".cx-webchat button.end-confirm.btn.btn-primary.i18n").click(function () {
        gtag('event', 'click', {
            'event_category': 'AFFINConnect',
            'event_label': "Live Chat - End Chat",
            'value': window.location.href
        });
    });
    $(".ga-call-us-phone").click(function () {
        gtag('event', 'click', {
            'event_category': 'AFFINConnect',
            'event_label': "Call Us Now - Number",
            'value': window.location.href
        });
    });
    $(".ga-go-to-top").click(function () {
        gtag('event', 'click', {
            'event_category': 'Back_To_Top',
            'event_label': "Back to Top",
            'value': window.location.href
        });
    });


    /*$(".ga_promotion_card h4").click( function() {

        gtag('event', 'click', {
          'event_category': 'Promotion_card',
          'event_label': $(this).text(),
          'value': window.location.href
        });
    });
    */

    /* END OF GA TAGS */


    var lFollowX = 0,
        lFollowY = 0,
        x = 0,
        y = 0,
        friction = 1 / 30;


    function moveBackground() {
        x += (lFollowX - x) * friction;
        y += (lFollowY - y) * friction;

        translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

        $('.para').css({
            '-webit-transform': translate,
            '-moz-transform': translate,
            'transform': translate
        });

        window.requestAnimationFrame(moveBackground);
    }

    $(window).on('mousemove click', function (e) {

        var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
        var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
        lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
        lFollowY = (10 * lMouseY) / 100;

    });

    //moveBackground();
    // $('#tipue_search_input').tipuesearch();


    $('.mobile_secondary a').on('click', function (e) {
        $('#drop').prop('checked', false); // Unchecks it
    });


    $("#main_drop").on("click", function () {
        if ($(this).is(":not(:checked)")) {
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });
            $('.head').css({
                position: 'relative',
                zIndex: '0'

            });
        } else {
            $('html, body').css({
                overflow: 'hidden',
                height: '100%'
            });
            $('.head').css({
                position: 'relative',
                zIndex: '-1'
            });
        }
    });

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        if (this.getAttribute("class") == 'mobile_a' || this.getAttribute("class") == 'mobile_b') {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - 135
            }, 900, 'swing');
            return;
        }
        if (this.getAttribute("class") == 'mobile_c') {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - 135
            }, 900, 'swing');
            return;
        }

        if ($target.length != 0) {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - 135
            }, 900, 'swing');
        }
    });


});

var _genesys = {
    cobrowse: {
        localization: 'https://' + window.location.hostname.replace("www", "gms") + '/static/master.json'
        //localization: 'https://gms.affinonline.com/static/master.json'
        //localization: 'http://mysasafnb130.abb.affinbank.com.my:8084/static/master.json'
    }
};

if (!window._genesys) window._genesys = {};
if (!window._gt) window._gt = [];

window._genesys.widgets = {
    main: {
        debug: true,
        theme: "light",
        lang: "en",
        customStylesheetID: "genesys_widgets_custom",
        plugins: [
            "cx-webchat",
            "cx-webchat-service",
            "cx-send-message",
            "cx-send-message-service",
            "cx-channel-selector",
            "cx-stats-service",
            "cx-call-us",
            "cx-callback-service",
            "cx-callback",
            "cx-calendar",
            "cx-sidebar",
            "cx-cobrowse"

        ]
    },
    webchat: {
        dataURL: "https://" + window.location.hostname.replace("www", "gms") + "/genesys/2/chat/contactcentre",
        //dataURL: "http://mysasafnb130.abb.affinbank.com.my:8080/genesys/2/chat/contactcentre",
        apikey: "",
        userData: {},
        autoInvite: {
            enabled: false,
            timeToInviteSeconds: 5,
            inviteTimeoutSeconds: 30
        },
        chatButton: {
            enabled: true,
            openDelay: 1000,
            effectDuration: 300,
            hideDuringInvite: true
        },
        uploadsEnabled: false,

    },
    cobrowse: {
        disableWebSockets: false,
        debug: true,
        cobrowse: {
            cometdConfig: {logLevel: "debug"}
        },
        //src: "http://mysasafnb130.abb.affinbank.com.my:8084/cobrowse/js/gcb.min.js",
        src: "https://" + window.location.hostname.replace("www", "gms") + "/cobrowse/js/gcb.min.js",
        //url: "http://mysasafnb130.abb.affinbank.com.my:8084/cobrowse"
        url: "https://" + window.location.hostname.replace("www", "gms") + "/cobrowse"
    },
    sendmessage: {
        dataURL: "https://" + window.location.hostname.replace("www", "gms") + "/genesys/2/email/contactcentreemail",
        //dataURL: "http://mysasafnb130.abb.affinbank.com.my:8080/genesys/2/email/contactcentreemail",
        apikey: "",
        SendMessageButton: {
            enabled: true
        }
    },
    stats: {
        ewt: {
            //dataURL: "http://mysasafnb128.abb.affinbank.com.my:5581",
            //dataURL: "https://gms.affinonline.com",
            dataURL: "https://" + window.location.hostname.replace("www", "gms"),
            apikey: ""
        }
    },
    channelselector: {
        ewtRefreshInterval: 10,
        channels: [
            {
                enable: true,
                clickCommand: "WebChat.open",
                readyEvent: "WebChat.ready",
                displayName: "Live Chat",
                i10n: "ChatTitle",
                icon: "chat",
                html: "",
                ewt: {
                    display: true,
                    queue: "",
                    availabilityThresholdMin: 300,
                    availabilityThresholdMax: 3600,
                    hideChannelWhenThresholdMax: false
                }
            },
            {
                enable: true,
                clickCommand: "CallUs.open",
                readyEvent: "CallUs.ready",
                displayName: "Call Us",
                i10n: "CallusTitle",
                icon: "call-outgoing",
                ewt: {
                    display: true,
                    queue: "",
                    availabilityThresholdMin: 300,
                    availabilityThresholdMax: 3600,
                    hideChannelWhenThresholdMax: false
                }
            },
            {
                enable: true,
                clickCommand: "Callback.open",
                readyEvent: "Callback.ready",
                displayName: "Receive a Call",
                i18n: "CallbackTitle",
                icon: "call-incoming",
                html: "",
                ewt: {
                    display: true,
                    queue: "",
                    availabilityThresholdMin: 300,
                    availabilityThresholdMax: 3600,
                    hideChannelWhenThresholdMax: false
                }
            },
            {
                enable: true,
                clickCommand: "SendMessage.open",
                readyEvent: "SendMessage.ready",
                displayName: "Email Us",
                i10n: "EmailTitle",
                icon: "email",
                html: ""
            }
        ]
    },
    callus: {
        contacts: [
            {
                displayName: "Contact Centre",
                i18n: "Number001",
                number: '+603-8230 2222'
            },
            {
                displayName: "Local",
                i18n: "Number002",
                number: "202 555 0134"
            },
            {
                displayName: "International",
                i18n: "Number003",
                number: "0647 555 0131"
            }
        ],
        hours: [
            "Mon - Sun",
            "<b>8:00 am - 12:00 am</b>"
        ]
    },
    callback: {
        dataURL: "https://" + window.location.hostname.replace("www", "gms") + "/genesys/1/admin/service/callback/Callback_AffinOnline",
        //dataURL: "http://mysasafnb130.abb.affinbank.com.my:8080/genesys/1/admin/service/callback/callbackdelayed",
        //dataURL: "http://mysasafnb130.abb.affinbank.com.my:8080/genesys/1/admin/service/callback/Callback_AffinOnline",
        callDirection: "",
        userData: {},
        countryCodes: false,
        formValidation: true,
        apikey: ""
    },
    sidebar: {
        showOnStartup: true,
        position: null,
        expandOnHover: false,
        channels: [
            {
                name: "ChannelSelector",
                clickCommand: "ChannelSelector.open",
                readyEvent: "ChannelSelector.ready",
                clickOptions: {},
                displayName: "Live Assist",
                displayTitle: "Get live help",
                icon: "agent"
            }
        ]
    }
};
