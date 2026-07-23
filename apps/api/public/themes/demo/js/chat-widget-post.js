if(window.location.hostname == "www.affingroup.com") throw new Error("Affingroup will not need this");
if(location.hostname === '' || location.hostname === null || location.href === 'about:blank') throw new Error("Pagebuilder will not need this!");

var oMyPlugin;
var idleTime, idleTime2 = 0;
var idleStatus;
var idleInterval, activeInterval;

var cooldown = 0;
var initiate_active;
var isactive = false;
var isPHoliday = false;
var current_time = new Date();
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
jQuery(function ($) {
    setTimeout(function () {
        oMyPlugin = window._genesys.widgets.bus.registerPlugin('MyPlugin');
        if (document.cookie.indexOf('chat_trigger=') >= 0) {
            clearInterval(idleInterval);
            clearTimeout(initiate_active);
            console.log("chat_trigger found");
        }

        for (var x in date_array) {
            //alert(date_array[x]);
            if ((current_time.getDate() == date_array[x].getDate()) &&
                (current_time.getMonth() == date_array[x].getMonth()) &&
                (current_time.getFullYear() == date_array[x].getFullYear())) {
                //Check if it's a holiday listed in the array of dates above
                //If yes, disable the prompts
                console.log('today is a holiday. prompt is a no-show');
                clearInterval(idleInterval);
                clearTimeout(initiate_active);
                isPHoliday = true;

            }
        }


    }, 10);

    idleInterval = setInterval(function () {
        //909 = 30 sec
        if (cooldown == 910) {
            return;
        }
        if (cooldown == 909) { //30 seconds
            cooldown = 910;
            if (document.cookie.indexOf('proactive_trigger=') >= 0) {
                return;
            } else if (document.cookie.indexOf('chat_trigger=') >= 0) {
                console.log("inactive_chat_trigger pause");
                return;
            } else {
                //timerIncrement();
                //alert('idle prompt');
            }
        } else {
            cooldown++;
            if (cooldown == 151) {// 5 seconds
                console.log('stop active countdown');
                console.log('start idle countdown');
                turnoff_active();
                isactive = false;
            }
        }
    }, 33);


    document.onmousemove = function (event) {
        myFunction(event)
    };
    document.ontouchmove = function (event) {
        myFunction(event)
    };
    //If it is Saturday or Sunday
    if ((current_day == 6) || (current_day == 0) || (isPHoliday)) {
        clearInterval(idleInterval);
        clearTimeout(initiate_active);
    } else {
        //if((current_hour < 9) || (current_hour >= 22)){
        if ((current_hour < 9) || (current_hour >= 18)) {
            clearInterval(idleInterval);
            clearTimeout(initiate_active);
        }
    }

    if (document.cookie.indexOf('chat_trigger=') >= 0) {
        clearInterval(idleInterval);
        clearTimeout(initiate_active);
    }


    function myFunction(e) {
        cooldown = 0;
        //turnon_active(); 20 April 2021 turnoff
    }


    function turnon_active() {
        if (!isactive) {
            isactive = true;
            console.log('stop idle countdown');
            console.log('start active countdown');
            if ((current_day == 6) || (current_day == 0) || (isPHoliday)) {
                clearInterval(idleInterval);
                clearTimeout(initiate_active);
            } else {

                //if((current_hour < 9) || (current_hour >= 22)){
                //if((current_hour < 7) || (current_hour >= 21)){
                if ((current_hour < 9) || (current_hour >= 18)) {
                    console.log('Not operating hours');
                    clearInterval(idleInterval);
                    clearTimeout(initiate_active);
                } else {
                    initiate_active = setTimeout(function () {
                        //alert("active prompt");
                        if (document.cookie.indexOf('active_trigger=') >= 0) {
                            clearInterval(idleInterval);
                        } else if (document.cookie.indexOf('chat_trigger=') >= 0) {
                            //return;
                            console.log("active_chat_trigger pause");
                            clearInterval(idleInterval);
                            //clearTimeout(initiate_active);
                        } else {
                            activeTimerIncrement();

                            //clearTimeout(initiate_active);
                        }
                    }, 90000);
                }
            }

        }
    }

    function turnoff_active() {
        clearTimeout(initiate_active);
    }

    function activeTimerIncrement() {
        $("#affin_launch_widget").css("pointer-events", "none");
        $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "none");
        $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "none");
        gtag('event', 'AutoPrompt', {
            'event_category': 'AFFINConnect',
            'event_label': "Live Chat - Active Prompt (1.5mins)",
            'value': window.location.href
        });
        oMyPlugin.command('Toaster.open', {

            type: 'custom',
            //type: 'generic',
            //body: 'Hello! Would you like some help with the selection? Our experts are available to answer questions.',
            body: '<div class="cx-widget ark cx-common-container cx-close cx-theme-light"><div class="cx-close cx-button-group cx-buttons-window-control"><button class="cx-button-minimize icon-minimize" tabindex="0"></button><button id="active_button_close" class="cx-button-close icon-close" tabindex="0" onclick="active_close_btn1()"></button></div><div class="cx-titlebar"><div class="cx-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><rect class="cx-svg-icon-shadow2" x="50" y="29" width="29" height="34"></rect><path class="cx-svg-icon-tone1" d="M50,8.3c-17.3,0-32.2,8-39.6,19.7c-3.2,5-5.2,10.6-5.2,16.7c0,13.2,8.8,24.7,21.8,31.1C27.1,92.7,8.3,95.7,8.3,95.7c24.5,0,34.5-5.5,41.1-14.6c0.2,0,0.4,0.1,0.6,0.1c18.1,0,33.7-8.8,40.7-21.4c2.6-4.6,4.1-9.7,4.1-15.1C94.9,24.6,74.8,8.3,50,8.3z M70.8,58.3H29.2c-2.3,0-4.2-1.9-4.2-4.2c0-2.3,1.9-4.2,4.2-4.2h41.7c2.3,0,4.2,1.9,4.2,4.2C75,56.5,73.1,58.3,70.8,58.3z M70.8,41.7H29.2c-2.3,0-4.2-1.9-4.2-4.2c0-2.3,1.9-4.2,4.2-4.2h41.7c2.3,0,4.2,1.9,4.2,4.2C75,39.8,73.1,41.7,70.8,41.7z"></path><path class="cx-svg-icon-shadow1" d="M90.7,59.8c2.6-4.6,4.1-9.7,4.1-15.1C94.9,24.6,74.8,8.3,50,8.3v25h20.8c2.3,0,4.2,1.9,4.2,4.2c0,2.3-1.9,4.2-4.2,4.2H50V50h20.8c2.3,0,4.2,1.9,4.2,4.2c0,2.3-1.9,4.2-4.2,4.2H50v22.8C68.1,81.2,83.7,72.4,90.7,59.8z"></path></svg></div><div class="cx-title i18n" data-message="Title">Hello</div></div><div class="banner_"><div class="black_bar"><div class="black_bar_title"><img class="black_bar_icon" src="/img/live_chat_icon_trans.png"> Live Chat</div></div><img class="mobile" src="/img/live_chat_m.png"/><img id="assistance_banner" class="desktop" src="/img/live_chat.png"/></div><div class="cx-body">Hello! Would you like some help? Our agents are available to answer your questions.</div><div class="cx-footer"><div class="cx-button-container"><div class="cx-button-group cx-buttons-binary"><button type="button" class="btn btn-default ga-active-cancel" tabindex="0" onclick="dismiss_toaster_active()">No, Thanks</button><button type="button" class="btn btn-primary ga-active-chat-now" tabindex="0" onclick="chat_now_option_active()">Chat</button></div></div><div class="cx-powered-by">Powered by <span class="icon-special-g-brandmark"></span>Genesys</div></div></div>',
            icon: 'chat',
            controls: 'close',
            immutable: false,
            buttons: {

                type: 'binary',
                primary: 'Chat',
                secondary: 'No, Thanks'

            }

        }).done(function (e) {

            // Toaster opened successfully
            /*setTimeout(function(){
            $("#e_medic_buynow, #e_medic_buynow_mobile").click( function() {
                gtag('event', 'click', {
                      'event_category': 'eMedic2019',
                      'event_label': 'Proactive Chat',
                      'value': window.location.href
                  });
              window.open("promotions#axaemediccamp", '_blank');
              $(this).dialog({ modal: true });
            });

            }, 1000);*/
        }).fail(function (e) {

            // Toaster failed to open properly
            alert('fail to open');
        });


    }


    function timerIncrement() {
        //idleTime = idleTime + 1;
        // if (idleTime >= 1) { // 3 minutes
        // window.location.reload();
        $("#affin_launch_widget").css("pointer-events", "none");
        $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "none");
        $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "none");
        gtag('event', 'AutoPrompt', {
            'event_category': 'AFFINConnect',
            'event_label': "Live Chat - Inactive Prompt (30secs)",
            'value': window.location.href
        });
        oMyPlugin.command('Toaster.open', {

            type: 'custom',
            //type: 'generic',
            //body: 'Hello! Would you like some help with the selection? Our experts are available to answer questions.',
            body: '<div class="cx-widget ark cx-common-container cx-close cx-theme-light"><div class="cx-close cx-button-group cx-buttons-window-control"><button class="cx-button-minimize icon-minimize" tabindex="0"></button><button id="proactive_button_close" class="cx-button-close icon-close" tabindex="0" onclick="proactive_close_btn1()"></button></div><div class="cx-titlebar"><div class="cx-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><rect class="cx-svg-icon-shadow2" x="50" y="29" width="29" height="34"></rect><path class="cx-svg-icon-tone1" d="M50,8.3c-17.3,0-32.2,8-39.6,19.7c-3.2,5-5.2,10.6-5.2,16.7c0,13.2,8.8,24.7,21.8,31.1C27.1,92.7,8.3,95.7,8.3,95.7c24.5,0,34.5-5.5,41.1-14.6c0.2,0,0.4,0.1,0.6,0.1c18.1,0,33.7-8.8,40.7-21.4c2.6-4.6,4.1-9.7,4.1-15.1C94.9,24.6,74.8,8.3,50,8.3z M70.8,58.3H29.2c-2.3,0-4.2-1.9-4.2-4.2c0-2.3,1.9-4.2,4.2-4.2h41.7c2.3,0,4.2,1.9,4.2,4.2C75,56.5,73.1,58.3,70.8,58.3z M70.8,41.7H29.2c-2.3,0-4.2-1.9-4.2-4.2c0-2.3,1.9-4.2,4.2-4.2h41.7c2.3,0,4.2,1.9,4.2,4.2C75,39.8,73.1,41.7,70.8,41.7z"></path><path class="cx-svg-icon-shadow1" d="M90.7,59.8c2.6-4.6,4.1-9.7,4.1-15.1C94.9,24.6,74.8,8.3,50,8.3v25h20.8c2.3,0,4.2,1.9,4.2,4.2c0,2.3-1.9,4.2-4.2,4.2H50V50h20.8c2.3,0,4.2,1.9,4.2,4.2c0,2.3-1.9,4.2-4.2,4.2H50v22.8C68.1,81.2,83.7,72.4,90.7,59.8z"></path></svg></div><div class="cx-title i18n" data-message="Title">Hello</div></div><div class="banner_"><div class="black_bar"><div class="black_bar_title"><img class="black_bar_icon" src="/img/live_chat_icon_trans.png"> Live Chat</div></div><img class="mobile" src="/img/live_chat_m.png"/><img id="assistance_banner" class="desktop" src="/img/live_chat.png"/></div><div class="cx-body">Hello! Would you like some help? Our agents are available to answer your questions.</div><div class="cx-footer"><div class="cx-button-container"><div class="cx-button-group cx-buttons-binary"><button type="button" class="btn btn-default ga-inactive-cancel" tabindex="0" onclick="dismiss_toaster()">No, Thanks</button><button type="button" class="btn btn-primary ga-inactive-chat-now" tabindex="0" onclick="chat_now_option()">Chat</button></div></div><div class="cx-powered-by">Powered by <span class="icon-special-g-brandmark"></span>Genesys</div></div></div>',
            icon: 'chat',
            controls: 'close',
            immutable: false,
            buttons: {

                type: 'binary',
                primary: 'Chat',
                secondary: 'No, Thanks'

            }

        }).done(function (e) {

            // Toaster opened successfully
            /*setTimeout(function(){
                $("#e_medic_buynow, #e_medic_buynow_mobile").click( function() {
                gtag('event', 'click', {
                  'event_category': 'eMedic2019',
                  'event_label': 'Proactive Chat',
                  'value': window.location.href
              });
              window.open("promotions#axaemediccamp", '_blank');
              $(this).dialog({ modal: true });
            });



                }, 1000);*/

        }).fail(function (e) {

            // Toaster failed to open properly
            alert('fail to open');
        });
    }

});

function dismiss_toaster() {
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    $(".cx-button-close").trigger("click");
    document.cookie = "proactive_trigger=triggered";
    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Inactive Prompt (30secs) - No, Thanks",
        'value': window.location.href
    });
}

function chat_now_option() {
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    clearInterval(idleInterval);
    clearTimeout(initiate_active);
    //Insert cookie to detect proactive trigger
    document.cookie = "proactive_trigger=triggered";
    //Insert cookie to detect live chat triggered before or not
    document.cookie = "chat_trigger=triggered";

    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Inactive Prompt (30secs) - Chat",
        'value': window.location.href
    });
    oMyPlugin.command('WebChat.open', {

        userData: {},
        form: {

            autoSubmit: false,
            //firstname: '',
            lastname: ' ',
            subject: 'proactive_idle'
        }

    }).done(function (e) {

        // WebChat opened successfully
        if ($("#chat_icon").is(".new_chat_icon")) {
            $(".cx-title.i18n").remove(".new_chat_icon");
        } else {
            $('.ark.cx-common-container.cx-webchat > .cx-titlebar > .cx-title').prepend('<img src="/img/live_chat_icon_trans.png" style="width: 40px;height: auto;" class="new_chat_icon" id="chat_icon"> ');
            // $('.ark.cx-common-container.cx-webchat > .cx-body').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;" id="emedic_banner" class="desktop"></a>');
            //$('.ark.cx-common-container.cx-webchat').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;position: absolute;bottom: 40px;" id="emedic_banner" class="mobile"></a> ');


            /*$("#emedic_banner").click( function() {
              window.open("promotions#axaemediccamp", '_blank');
              $(this).dialog({ modal: true });
            });*/
        }

        $(".cx-webchat button.submit.btn.btn-primary.i18n").click(function () {
            if ($('#cx_webchat_form_firstname').val() != "") {
                gtag('event', 'click', {
                    'event_category': 'AFFINConnect',
                    'event_label': "Live Chat - Let's Chat - Inactive Prompt",
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

                        $('.cx-widget.cx-webchat .cx-button-close.icon-close').on('click', function () {

                            // document.ontouchmove = undefined;

                            $(".cx-webchat button.end-confirm.btn.btn-primary.i18n").click(function () {
                                gtag('event', 'click', {
                                    'event_category': 'AFFINConnect',
                                    'event_label': "Live Chat - End Chat - Inactive Prompt",
                                    'value': window.location.href
                                });
                            });

                        });


                    }, 1000);
            }


        });


    }).fail(function (e) {

        // WebChat isn't open or no active chat session
    });

}

function dismiss_toaster_active() {
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    $(".cx-button-close").trigger("click");
    document.cookie = "active_trigger=triggered";
    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Active Prompt (1.5mins) - No, Thanks",
        'value': window.location.href
    });
}

function chat_now_option_active() {
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    clearInterval(idleInterval);
    clearTimeout(initiate_active);
    //Insert cookie to detect active trigger
    document.cookie = "active_trigger=triggered";
    //Insert cookie to detect live chat triggered before or not
    document.cookie = "chat_trigger=triggered";

    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Active Prompt (1.5mins) - Chat",
        'value': window.location.href
    });

    oMyPlugin.command('WebChat.open', {

        userData: {},
        form: {

            autoSubmit: false,
            //firstname: '',
            lastname: ' ',
            subject: 'proactive_active'
        }

    }).done(function (e) {

        // WebChat opened successfully
        //if ( $( "#chat_icon" ).is( ".fa-comment" ) ) {
        //$( ".cx-title.i18n" ).remove( "#chat_icon" );
        if ($("#chat_icon").is(".new_chat_icon")) {
            $(".cx-title.i18n").remove(".new_chat_icon");
        } else {
            $('.ark.cx-common-container.cx-webchat > .cx-titlebar > .cx-title').prepend('<img src="/img/live_chat_icon_trans.png" style="width: 40px;height: auto;" class="new_chat_icon" id="chat_icon"> ');
            //$('.ark.cx-common-container.cx-webchat > .cx-body').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;" id="emedic_banner" class="desktop"></a>');

            //$('.ark.cx-common-container.cx-webchat').append('<a href="javascript:void(0)"><img src="/img/e_medic_card.jpg" style="width: 100%;height: auto;position: absolute;bottom: 40px;" id="emedic_banner" class="mobile"></a> ');

            /*$("#emedic_banner").click( function() {
             window.open("promotions#axaemediccamp", '_blank');
             $(this).dialog({ modal: true });
           });*/
        }

        $(".cx-webchat button.submit.btn.btn-primary.i18n").click(function () {
            if ($('#cx_webchat_form_firstname').val() != "") {
                gtag('event', 'click', {
                    'event_category': 'AFFINConnect',
                    'event_label': "Live Chat - Let's Chat - Active Prompt",
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


                        $('.cx-widget.cx-webchat .cx-button-close.icon-close').on('click', function () {
                            // document.ontouchmove = undefined;

                            $(".cx-webchat button.end-confirm.btn.btn-primary.i18n").click(function () {
                                gtag('event', 'click', {
                                    'event_category': 'AFFINConnect',
                                    'event_label': "Live Chat - End Chat - Active Prompt",
                                    'value': window.location.href
                                });
                            });

                        });


                    }, 1000);
            }


        });
    }).fail(function (e) {

        // WebChat isn't open or no active chat session
    });

}

function active_close_btn1() {
    document.cookie = "active_trigger=triggered";
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Active Prompt (1.5mins) - No, Thanks",
        'value': window.location.href
    });
}

function proactive_close_btn1() {
    document.cookie = "proactive_trigger=triggered";
    $("#affin_launch_widget").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light.cx-mobile").css("pointer-events", "auto");
    $(".cx-widget.cx-sidebar.px32.preset-blue.cx-theme-light").css("pointer-events", "auto");
    gtag('event', 'click', {
        'event_category': 'AFFINConnect',
        'event_label': "Live Chat - Inactive Prompt (30secs) - No, Thanks",
        'value': window.location.href
    });
}
