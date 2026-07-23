// (General)
function generalGtag() {
    // (Widget) Affin Chat Widget
    if (document.querySelector('#affin_launch_widget')) {
        // AA List 24, A1addin List 22
        if (window.matchMedia("(max-width: 1023px)").matches) {
            $(document).on("click", "#affin_launch_widget", function () {
                gtag('event', 'click', {
                    'event_category': 'Affin Chat',
                    'event_label': 'Affin Chat Menu Mobile',
                    'value': window.location.href
                });
            });
        } else { // AA List 23, A1addin List 21
            $(document).on("click", "#affin_launch_widget", function () {
                gtag('event', 'click', {
                    'event_category': 'Affin Chat',
                    'event_label': 'Affin Chat Menu',
                    'value': window.location.href
                });
            });
        }

        // AA List 25, A1addin List 23
        $(document).on("click", ".cx-widget .Channel01", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Call Us Now',
                'value': window.location.href
            });
        });

        // AA List 26, A1addin List 24
        $(document).on("click", ".cx-widget .cx-call-us .ga-call-us-phone a:first", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Call Us Now - Number',
                'value': window.location.href
            });
        });

        // AA List 27 (cancel btn), A1addin List 25
        $(document).on("click", ".cx-widget .cx-call-us .cancel", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Call Us Now - Cancel',
                'value': window.location.href
            });
        });

        // AA List 28, A1addin List 26
        $(document).on("click", ".cx-widget .Channel03", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Email Us',
                'value': window.location.href
            });
        });

        // AA List 29, A1addin List 27
        $(document).on("click", ".cx-widget .Channel00", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Live Chat',
                'value': window.location.href
            });
        });

        // AA List 30, A1addin List 28
        $(document).on("click", ".cx-widget .cx-webchat button[data-message=ChatFormSubmit]", function () {
            if ($(".cx-widget .cx-webchat #cx_webchat_form_firstname").val()) {
                var tempName = $(".cx-webchat #cx_webchat_form_firstname").val().trim();
                if (tempName) {
                    gtag('event', 'click', {
                        'event_category': 'Affin Chat',
                        'event_label': 'Live Chat - Start Chat',
                        'value': window.location.href
                    });
                }
            }
        });

        // AA List 32 ("Close" Btn), A1addin List 30
        $(document).on("click", ".cx-widget .cx-webchat button[data-message=ChatFormCancel]", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Live Chat - Cancel',
                'value': window.location.href
            });
        });

        // AA List 32 ("X" Btn), A1addin List 30
        $(document).on("click", ".cx-widget .cx-webchat .cx-button-close", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Live Chat - Cancel',
                'value': window.location.href
            });
        });

        // AA List 33, A1addin List 31
        $(document).on("click", ".cx-widget .cx-webchat button[data-message=ConfirmCloseConfirm]", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Live Chat - Cancel (Yes)',
                'value': window.location.href
            });
        });

        // AA List 34, A1addin List 2
        $(document).on("click", ".cx-widget .cx-webchat button[data-message=ConfirmCloseCancel]", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Live Chat - Cancel (No)',
                'value': window.location.href
            });
        });

        // AA List 35, A1addin List 33
        $(document).on("click", ".cx-widget .Channel02", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call',
                'value': window.location.href
            });
        });

        // AA List 36 ("X" Btn), A1addin List 34
        $(document).on("click", ".cx-widget .cx-callback-container .cx-button-close", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call - Cancel',
                'value': window.location.href
            });
        });

        // AA List 36 ("Cancel" Btn), A1addin List 34
        $(document).on("click", ".cx-widget .cx-callback-container .cx-callback-cancel", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call - Cancel',
                'value': window.location.href
            });
        });

        // AA List 37, A1addin List 35
        $(document).on("click", ".cx-widget .cx-callback-container button[data-message=CallbackYesButtonText]", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call - Cancel (Yes)',
                'value': window.location.href
            });
        });

        // AA List 38, A1addin List 36
        $(document).on("click", ".cx-widget .cx-callback-container button[data-message=CallbackNoButtonText]", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call - Cancel (No)',
                'value': window.location.href
            });
        });

        // AA List 39, A1addin List 37
        $(document).on("click", ".cx-widget .cx-callback-container .cx-callback-confirm", function () {
            gtag('event', 'click', {
                'event_category': 'Affin Chat',
                'event_label': 'Receive a Call - Confirm',
                'value': window.location.href
            });
        });
    }

    // (Block Discover Promotion) AA List 20 - Discover All Btn
    if (document.querySelector('.block-discover-promotions')) {
        $(document).on("click", ".block-discover-promotions #all-promo-btn", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Promotions',
                'value': window.location.href
            });
        });
    }

    // (Block Discover Announcement) AA List 22 - Discover All Btn
    if (document.querySelector('.block-discover-announcement')) {
        $(document).on("click", ".block-discover-announcement .button", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Announcement',
                'value': window.location.href
            });
        });
    }

    // (Block Affin Always Mortage Calculator) AA List 42 & 44
    if (document.querySelector('.block-affin-always-mortage-calculator')) {
        // (Block Affin Always Mortage Calculator) AA List 42 - Check Result Btn
        $(document).on("click", ".block-affin-always-mortage-calculator .check-result-btn", function () {
            gtag('event', 'click', {
                'event_category': 'My Loans & Financing',
                'event_label': 'Loan Recommender',
                'value': window.location.href
            });
        });

        // (Block Affin Always Mortage Calculator) AA List 44 - Loan Purposes
        $(".block-affin-always-mortage-calculator .loan-purpose-btn").each(function () {
            var tempValue = $(this).text();
            var tempbool = false;

            $(this).click(function () {
                if (tempbool === false) {
                    tempbool = true;
                    gtag('event', 'click', {
                        'event_category': 'My Loans & Financing_Home Loan Recommender',
                        'event_label': "Loan Purpose: " + tempValue,
                        'value': window.location.href
                    });
                } else {
                    tempbool = false;
                }
            });
        });

        // (Block Affin Always Mortage Calculator) AA List 44 - Salary Slider
        $(".block-affin-always-mortage-calculator .__range-step-salary input").click(function () {
            gtag('event', 'click', {
                'event_category': 'My Loans & Financing_Home Loan Recommender',
                'event_label': "Income: " + $(this).val(),
                'value': window.location.href
            });
        });

        // (Block Affin Always Mortage Calculator) AA List 44 - Age Slider
        $(".block-affin-always-mortage-calculator .__range-step-mortage input").click(function () {
            gtag('event', 'click', {
                'event_category': 'My Loans & Financing_Home Loan Recommender',
                'event_label': "Age: " + $(this).val(),
                'value': window.location.href
            });
        });
    }

    // (Block Loan Calculator) AA List 43 - Loan Calculate Btn
    if (document.querySelector('.loan-calculator-header-block')) {
        $(document).on("click", ".loan-calculator-header-block .loan-cal-btn button:first", function () {
            gtag('event', 'click', {
                'event_category': 'My Loans & Financing',
                'event_label': 'Loan Calculator',
                'value': window.location.href
            });
        });
    }

    // (Block Affin Always Card Boxes) AA List 45 - Card Add To Compare Btns
    if (document.querySelector('.affin-always-card-boxes')) {
        $(".affin-always-card-boxes .add-to-compare-button").each(function () {
            gtag('event', 'click', {
                'event_category': 'My Cards',
                'event_label': 'Cards Comparison',
                'value': window.location.href
            });
        });
    }

    // (Block Affin Always Salary Range) AA List 46 - Check Result Btn
    if (document.querySelector('.block-affin-always-salary-range')) {
        $(document).on("click", ".block-affin-always-salary-range .check-result-btn", function () {
            gtag('event', 'click', {
                'event_category': 'My Cards',
                'event_label': 'Cards Recommender',
                'value': window.location.href
            });
        });
    }

    // (Block Risk Profile) AA List 47
    if (document.querySelector('.block-risk-profile-wrapper')) {
        // (Block Risk Profile) AA List 47 - Plan To Invest Btn
        $(".block-risk-profile-wrapper #plan-to-invest .bg-next").click(function () {
            if ($(".block-risk-profile-wrapper .btn-risk-profile[data-question=plan-to-invest][data-status=click]").text()) {
                gtag('event', 'click', {
                    'event_category': 'Risk Profile',
                    'event_label': "Plan to invest: " + $(".block-risk-profile-wrapper .btn-risk-profile[data-question=plan-to-invest][data-status=click]").text(),
                    'value': window.location.href
                });
            }
        });

        // (Block Risk Profile) AA List 47 - Investment Goal Next Btn
        $(".block-risk-profile-wrapper #investment-goal .bg-next").click(function () {
            if ($(".block-risk-profile-wrapper .btn-risk-profile[data-question=investment-goal][data-status=click]").text()) {
                gtag('event', 'click', {
                    'event_category': 'Risk Profile',
                    'event_label': "Investment Goal: " + $(".block-risk-profile-wrapper .btn-risk-profile[data-question=investment-goal][data-status=click]").text(),
                    'value': window.location.href
                });
            }
        });

        // (Block Risk Profile) AA List 47 - Passive Income Next Btn
        $(".block-risk-profile-wrapper #passive-income .bg-next").click(function () {
            if ($(".block-risk-profile-wrapper .btn-risk-profile[data-question=investment-goal][data-status=click]").text()) {
                gtag('event', 'click', {
                    'event_category': 'Risk Profile',
                    'event_label': "Passive Income: " + $(".block-risk-profile-wrapper input[name=customRadio]:checked").next().text(),
                    'value': window.location.href
                });
            }
        });
    }
}

// (Affin Always)
function affinAlwaysGtag() {
    // (Header) - Nav Bar
    if (document.querySelector('.block-navbar')) {
        // AA List 1
        $(document).on("click", ".block-navbar #myNavbarLogin a:first", function () {
            gtag('event', 'click', {
                'event_category': 'Login',
                'event_label': 'Personal',
                'value': window.location.href
            });
        });

        // AA List 2
        $(document).on("click", ".block-navbar #myNavbarLogin a:last", function () {
            gtag('event', 'click', {
                'event_category': 'Login',
                'event_label': 'Business',
                'value': window.location.href
            });
        });

        // AA List 3
        $(".block-navbar .menu-img").closest(".navbar-element").click(function () {
            gtag('event', 'click', {
                'event_category': 'Hamburger_Menu',
                'event_label': 'Main Menu',
                'value': window.location.href
            });
        });

        // AA List 5 - 11
        $(".block-navbar #navbar-tab .privacy-notice-list-tabs").each(function () {
            var tempText = $(this).text();

            $(this).click(function () {
                gtag('event', 'click', {
                    'event_category': 'Hamburger_Menu',
                    'event_label': tempText,
                    'value': window.location.href
                });
            });
        });

        // AA List 12 - 15
        $(".block-navbar #navbar-tab #card-box .box").each(function () {
            var tempText = $(this).text();

            $(this).click(function () {
                gtag('event', 'click', {
                    'event_category': 'Hamburger_Menu',
                    'event_label': tempText,
                    'value': window.location.href
                });
            });
        });

        // AA List 18
        $(".block-navbar .navbar-img").closest(".navbar-brand").click(function () {
            gtag('event', 'click', {
                'event_category': 'Homepage',
                'event_label': 'Homepage',
                'value': window.location.href
            });
        });

        // AA List 52
        $(document).on("click", ".block-navbar .navbar .navsearch-img", function () {
            gtag('event', 'click', {
                'event_category': 'Search',
                'event_label': 'Search Button',
                'value': window.location.href
            });
        });
    }

    // Discover Product
    if (document.querySelector('.block-discover-product')) {
        // AA List 21
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(5) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'AFFIN INVIKTA',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(5) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'AFFIN INVIKTA',
                'value': window.location.href
            });
        });

        // AA List 54
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Deposits',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Deposits',
                'value': window.location.href
            });
        });

        // AA List 55
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(5) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Cards',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(5) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Cards',
                'value': window.location.href
            });
        });

        // AA List 56
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(7) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Loans & Financing',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(7) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Loans & Financing',
                'value': window.location.href
            });
        });

        // AA List 57
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(9) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Protection',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(9) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Protection',
                'value': window.location.href
            });
        });

        // AA List 58
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(11) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Investments',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(3) > div > div.product-inside.text-left > div:nth-child(11) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'My Investments',
                'value': window.location.href
            });
        });

        // AA List 59
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(4) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'AFFIN AVANCE',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(4) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'AFFIN AVANCE',
                'value': window.location.href
            });
        });

        // AA List 60
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Deposits',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Deposits',
                'value': window.location.href
            });
        });

        // AA List 61
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(7) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Trade Facilities',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(7) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Trade Facilities',
                'value': window.location.href
            });
        });

        // AA List 62
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(5) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Loans & Financing',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(5) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Loans & Financing',
                'value': window.location.href
            });
        });

        // AA List 63
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(9) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Protection',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(9) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Protection',
                'value': window.location.href
            });
        });

        // AA List 64
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(11) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Digital Solutions',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(11) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_Digital Solutions',
                'value': window.location.href
            });
        });

        // AA List 65
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(13) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_All-in-One Solutions',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(6) > div > div.product-inside.text-left > div:nth-child(13) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'SME_All-in-One Solutions',
                'value': window.location.href
            });
        });

        // AA List 65
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Deposit',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Deposit',
                'value': window.location.href
            });
        });

        // AA List 65
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(5) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Trade Facilities',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(5) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Trade Facilities',
                'value': window.location.href
            });
        });

        // AA List 65
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(7) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Loans & Financing',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(7) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Loans & Financing',
                'value': window.location.href
            });
        });

        // AA List 65
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(9) > div > a:nth-child(1)", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Cash Management',
                'value': window.location.href
            });
        });
        $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(7) > div > div.product-inside.text-left > div:nth-child(9) > div > a.link-text", function () {
            gtag('event', 'click', {
                'event_category': 'Homepage_Discover',
                'event_label': 'Corporate_Cash Management',
                'value': window.location.href
            });
        });
    }

    // (Block Image Left Text Right (Used for Personalised)) AA List 19
    if (window.location.href.indexOf("www.affinalways.com/en/homepage") >= 0 || window.location.href.indexOf("www.affinalways.com/bm/homepage") >= 0) {
        if (document.querySelector('.block-img-left-text-right-with-btn')) {
            $(document).on("click", ".block-img-left-text-right-with-btn .button:first", function () {
                gtag('event', 'click', {
                    'event_category': 'Homepage_Discover',
                    'event_label': 'Personalised Solutions',
                    'value': window.location.href
                });
            });
        }

        // Discover What you need
        if (document.querySelector('.block-discover-product ')) {
            $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(8) > div > div.product-inside.text-left > div:nth-child(3) > div > a:nth-child(1)", function () {
                gtag('event', 'click', {
                    'event_category': 'Homepage_Discover',
                    'event_label': 'A1addin',
                    'value': window.location.href
                });
            });

            $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(8) > div > div.product-inside.text-left > div:nth-child(3) > div > a.link-text", function () {
                gtag('event', 'click', {
                    'event_category': 'Homepage_Discover',
                    'event_label': 'A1addin',
                    'value': window.location.href
                });
            });

            $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(8) > div > div.product-inside.text-left > div:nth-child(5) > div > a:nth-child(1)", function () {
                gtag('event', 'click', {
                    'event_category': 'Homepage_Discover',
                    'event_label': 'A1addinbiz',
                    'value': window.location.href
                });
            });

            $(document).on("click", ".block-discover-product #listing-carousel > div:nth-child(8) > div > div.product-inside.text-left > div:nth-child(5) > div > a.link-text", function () {
                gtag('event', 'click', {
                    'event_category': 'Homepage_Discover',
                    'event_label': 'A1addinbiz',
                    'value': window.location.href
                });
            });
        }
    }

    // (Footer) AA List 53 - Back To Top Btn
    $(document).on("click", ".block-footer .back-to-top", function () {
        gtag('event', 'click', {
            'event_category': 'Back_To_Top',
            'event_label': 'Back to Top',
            'value': window.location.href
        });
    });
}

// (A1addin)
function a1addinGtag() {
    // (Header) - Navbar
    if (document.querySelector('.block-a1addin-navbar')) {
        // Homepage but missing
        // $("#a1addin-logo").closest("a").click(function() {
        //     gtag('event', 'click', {
        //         'event_category': 'A1addin_Header',
        //         'event_label': 'Main Menu',
        //         'value': window.location.href
        //     });
        // });

        // A1addin List 1 - 4
        $(".block-a1addin-navbar #navbar-url a").each(function () {
            var tempText = $(this).text();

            $(this).click(function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_Header',
                    'event_label': tempText,
                    'value': window.location.href
                });
            });
        });

        // A1addin List 5
        $(document).on("click", ".block-a1addin-navbar .download-button-in-desktop-size", function () {
            gtag('event', 'click', {
                'event_category': 'A1addin_Header',
                'event_label': 'Download A1addin',
                'value': window.location.href
            });
        });

        // A1addin List 5
        $(document).on("click", ".block-a1addin-navbar .download-button-in-mobile-size", function () {
            gtag('event', 'click', {
                'event_category': 'A1addin_Header',
                'event_label': 'Download A1addin',
                'value': window.location.href
            });
        });
    }

    // (Footer) - Download Links Block
    if (document.querySelector('.block-a1addin-download-links')) {
        // A1addin List 19 - Footer Download Link Google Play
        $(document).on("click", ".block-a1addin-download-links .image-row .image a:first", function () {
            gtag('event', 'click', {
                'event_category': 'A1addin_Download',
                'event_label': 'Download A1addin - Android',
                'value': window.location.href
            });
        });

        // A1addin List 20 - Footer Download Link App Store
        $(document).on("click", ".block-a1addin-download-links .image-row .image a:last", function () {
            gtag('event', 'click', {
                'event_category': 'A1addin_Download',
                'event_label': 'Download A1addin - IOS',
                'value': window.location.href
            });
        });
    }

    // (A1addin Homepage)
    if (window.location.href.indexOf("www.a1addin.com/homepage") >= 0) {
        // A1addin List 6 - 7 - Personal And Business Explore Btn
        if (document.querySelector('.block-a1addin-cta')) {
            $(".block-a1addin-cta").each(function () {
                // var tempId = $(this).attr("id");
                var tempText = $(this).find("h2").text();
                $(this).find(".explore-btn").click(function () {
                    gtag('event', 'click', {
                        'event_category': 'A1addin_Main_Page',
                        'event_label': tempText + "- Explore Now",
                        'value': window.location.href
                    });
                });
            });
        }

        // A1addin List 8 - Call Us Phone Number
        if (document.querySelector('.block-a1addin-contact-us')) {
            $(document).on("click", ".block-a1addin-contact-us a:last", function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_Main_Page',
                    'event_label': 'Contact Us - Phone Number',
                    'value': window.location.href
                });
            });
        }
    }

    // (A1addin FAQ Page)
    if (window.location.href.indexOf("www.a1addin.com/faq") >= 0) {
        // A1addin List 9 - 12
        if (document.querySelector('.block-a1addin-faq-multitab-questions')) {
            $(".block-a1addin-faq-multitab-questions #category .text-category").each(function () {
                var tempText = $(this).text();

                $(this).click(function () {
                    gtag('event', 'click', {
                        'event_category': 'A1addin_FAQ',
                        'event_label': tempText,
                        'value': window.location.href
                    });
                });
            });
        }

        // A1addin List 13 - 14
        if (document.querySelector('.block-a1addin-faq-contact')) {
            // A1addin List 13
            $(document).on("click", ".block-a1addin-faq-contact .contact-box a:first", function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_FAQ',
                    'event_label': 'Phone Number',
                    'value': window.location.href
                });
            });

            // A1addin List 14
            $(document).on("click", ".block-a1addin-faq-contact .contact-box a:last", function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_FAQ',
                    'event_label': 'Email',
                    'value': window.location.href
                });
            });
        }

        // A1addin List 17 - 18
        if (document.querySelector('.block-a1addin-faq-account')) {
            // A1addin List 17
            $(document).on("click", ".block-a1addin-faq-account .explore-btn:first", function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_FAQ',
                    'event_label': 'Youtube - Scan NRIC',
                    'value': window.location.href
                });
            });

            // A1addin List 18
            $(document).on("click", ".block-a1addin-faq-account .explore-btn:last", function () {
                gtag('event', 'click', {
                    'event_category': 'A1addin_FAQ',
                    'event_label': 'Youtube - Selfie Verification',
                    'value': window.location.href
                });
            });
        }
    }

    // (A1addin QR Pay Section Block)
    if (document.querySelector('.block-a1addin-linear-gradient-cta')) {
        // A1addin List 15
        if (window.location.href.indexOf("www.a1addin.com/personal") >= 0) {
            $(document).on("click", ".block-a1addin-linear-gradient-cta .explore-btn", function () {
                gtag('event', 'click', {
                    'event_category': "A1addin_Personal",
                    'event_label': 'Download A1addin',
                    'value': window.location.href
                });
            });
        } else if (window.location.href.indexOf("www.a1addin.com/business") >= 0) { // A1addin List 16
            $(document).on("click", ".block-a1addin-linear-gradient-cta .explore-btn", function () {
                gtag('event', 'click', {
                    'event_category': "A1addin_Business",
                    'event_label': 'Download A1addin',
                    'value': window.location.href
                });
            });
        }
    }
}

// (Affin Group Header Footer)
function affinGroupGtag() {

}

$(document).ready(function () {
    setTimeout(function () {
        // Scope header and footer gtag for different domains
        if (window.location.href.indexOf("www.a1addin.com") >= 0) {
            a1addinGtag();

        } else if (window.location.href.indexOf("www.affingroup.com") >= 0) {

        } else if (window.location.href.indexOf("www.affinalways.com") >= 0) {
            affinAlwaysGtag();
        }

        generalGtag();
    }, 2000);
});
