/* Detect Hero Block With 'Share This' Button */
/* And Add Share Page Function */

var logo = document.querySelector('a[style="padding-left: 0px;"]');

function ready(f) {
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
}

ready(function () {
    if (logo) {
        logo.href = '/homepage';
    }

    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            addShareBtnToHeroWithTagAndBtn(lang);
            addShareBtnToHeroWithCard(lang);
            addShareBtnToHeroAdvanced(lang);
            externalLinkDisclaimerTextBM(lang);
            addA1addinLanguageButton(lang);
            a1addinCopyrightInBM(lang);
        });

    initializeA1addinNavbar();
    loadFile();
});

function addA1addinLanguageButton(lang) {
    var tempLanguageText;

    switch (lang) {
        case 'zh':
            tempLanguageText = " Language ZH";
            break;
        case 'ms':
            tempLanguageText = " Bahasa";
            break;
        case 'en':
        default:
            tempLanguageText = " Language";
            break;
    }

    const downloadBtn = document.querySelector('.block-a1addin-navbar #btn-right');

    if (downloadBtn) {
        const langBtnDesktop = document.createElement('SPAN');
        langBtnDesktop.setAttribute("id", "a1addin-lang-btn-desktop");
        langBtnDesktop.setAttribute("class", "a1addin-lang-btn a1addin-lang-btn-desktop");
        langBtnDesktop.addEventListener("click", a1addinNavLangModalToggle);

        langBtnDesktop.innerHTML = '<img src="/img/globe-white.svg" id="a1addin-lang-icon" height="25">' + tempLanguageText +
            '<div class="a1addin-lang-modal" id="langModal">' +
            '<a href="/switchLang/en" class="a1addin-lang-modal-link">' + "EN" + '</a>' +
            '<hr class="my-3">' +
            '<a href="/switchLang/ms" class="a1addin-lang-modal-link">' + "BM" + '</a>' +
            '<div class="a1addin-lang-modal-triangle"></div>' +
            '</div>'

        downloadBtn.after(langBtnDesktop);

        const navbarUrls = document.querySelector('.block-a1addin-navbar #navbar-url');

        if (navbarUrls) {
            const langBtnMobile = document.createElement('a');
            langBtnMobile.setAttribute("id", "a1addin-lang-btn-mobile");
            langBtnMobile.setAttribute("class", "a1addin-lang-btn-mobile pt-md-5 text-capitalize");
            langBtnMobile.setAttribute("href", "#99");
            langBtnMobile.addEventListener("click", a1addinNavLangModalToggle);

            langBtnMobile.innerHTML = tempLanguageText +
                '<div class="a1addin-lang-modal" id="langModal">' +
                '<a href="/switchLang/en" class="a1addin-lang-modal-link">' + "EN" + '</a>' +
                '<hr class="my-3">' +
                '<a href="/switchLang/ms" class="a1addin-lang-modal-link">' + "BM" + '</a>' +
                '<div class="a1addin-lang-modal-triangle"></div>' +
                '</div>'

            navbarUrls.appendChild(langBtnMobile);
        }
    }
}

function a1addinNavLangModalToggle() {
    var tempOwnModal = $(this).find(".a1addin-lang-modal");

    if (tempOwnModal) {
        tempOwnModal.toggle();
    }
}


function addShareBtnToHeroWithTagAndBtn(lang) {
    const heroWithTagAndBtnShareBtn = document.querySelector('.block-hero-with-tag-and-btn a.ml-2');
    if (heroWithTagAndBtnShareBtn && lang === 'ms') {
        heroWithTagAndBtnShareBtn.innerHTML = 'Kongsi';
    }

    const buttonContainer = document.querySelector('.block-hero-with-tag-and-btn .align-items-button');

    const shareButtonContainer = document.createElement('DIV');
    shareButtonContainer.className = 'share-block-container';
    shareButtonContainer.innerHTML = '<div id="shareBlock" class="d-none"></div>';

    if (buttonContainer) {
        buttonContainer.parentNode.insertBefore(shareButtonContainer, buttonContainer.nextSibling);
    }

    const shareBlockContainer = document.querySelector('.block-hero-with-tag-and-btn .share-block-container');
    if (shareBlockContainer) {
        shareBlockContainer.style.minHeight = '30px';
        shareBlockContainer.style.backgroundColor = '#FFFFFF';
        shareBlockContainer.style.width = 'fit-content';
        shareBlockContainer.style.borderRadius = '5px';
        shareBlockContainer.style.marginLeft = '50px';
        shareBlockContainer.style.position = 'absolute';
        shareBlockContainer.style.zIndex = '5';
    }

    const shareBlock = document.querySelector('.block-hero-with-tag-and-btn #shareBlock');
    if (shareBlock) {
        shareBlock.style.padding = '5px';
    }

    if (heroWithTagAndBtnShareBtn && buttonContainer) {
        heroWithTagAndBtnShareBtn.href = '#99';
        heroWithTagAndBtnShareBtn.addEventListener('click', triggerHeroWithTagAndBtnShareButton);
    }
}

function triggerHeroWithTagAndBtnShareButton() {
    document.querySelector('.block-hero-with-tag-and-btn #shareBlock').classList.remove('d-none');
    $('.block-hero-with-tag-and-btn #shareBlock').cShare({
        showButtons: ['fb', 'whatsapp', 'twitter', 'email'],
        shareToText: 'Share to'
    });
    const shareThisBtn = document.querySelector('.block-hero-with-tag-and-btn a.ml-2');
    if (shareThisBtn) {
        shareThisBtn.removeEventListener('click', triggerHeroWithTagAndBtnShareButton);

        shareThisBtn.addEventListener('click', function () {
            const shareBlock = document.querySelector('.block-hero-with-tag-and-btn #shareBlock');
            if (shareBlock) {
                if (shareBlock.classList.contains('d-none')) {
                    shareBlock.classList.remove('d-none');
                } else {
                    shareBlock.classList.add('d-none');
                }
            }
        })
    }
}

function addShareBtnToHeroWithCard(lang) {
    const heroWithCardShareBtn = document.querySelector('.block-hero-with-card a.text-white.ml-2.pt-3.pt-md-5');

    if (heroWithCardShareBtn && lang === 'ms') {
        heroWithCardShareBtn.innerHTML = 'Kongsi';
    }

    const shareButtonContainer = document.createElement('DIV');
    shareButtonContainer.className = 'share-block-container';
    shareButtonContainer.innerHTML = '<div id="shareBlock" class="d-none"></div>';

    if (heroWithCardShareBtn) {
        heroWithCardShareBtn.parentNode.insertBefore(shareButtonContainer, heroWithCardShareBtn.nextSibling);
        heroWithCardShareBtn.href = '#99';
        heroWithCardShareBtn.addEventListener('click', triggerHeroWithCardShareButton);
    }

    const shareBlockContainer = document.querySelector('.block-hero-with-card .share-block-container');
    if (shareBlockContainer) {
        shareBlockContainer.style.minHeight = '30px';
        shareBlockContainer.style.backgroundColor = '#FFFFFF';
        shareBlockContainer.style.width = 'fit-content';
        shareBlockContainer.style.borderRadius = '5px';
        shareBlockContainer.style.marginLeft = '50px';
        shareBlockContainer.style.position = 'absolute';
        shareBlockContainer.style.zIndex = '5';
    }

    const shareBlock = document.querySelector('.block-hero-with-card #shareBlock');
    if (shareBlock) {
        shareBlock.style.padding = '5px';
    }
}

function triggerHeroWithCardShareButton() {
    document.querySelector('.block-hero-with-card #shareBlock').classList.remove('d-none');
    $('.block-hero-with-card #shareBlock').cShare({
        showButtons: ['fb', 'whatsapp', 'twitter', 'email'],
        shareToText: 'Share to'
    });
    const shareThisBtn = document.querySelector('.block-hero-with-card a.text-white.ml-2.pt-3.pt-md-5');
    if (shareThisBtn) {
        shareThisBtn.removeEventListener('click', triggerHeroWithCardShareButton);

        shareThisBtn.addEventListener('click', function () {
            const shareBlock = document.querySelector('.block-hero-with-card #shareBlock');
            if (shareBlock) {
                if (shareBlock.classList.contains('d-none')) {
                    shareBlock.classList.remove('d-none');
                } else {
                    shareBlock.classList.add('d-none');
                }
            }
        })
    }
}

function addShareBtnToHeroAdvanced(lang) {
    const heroAdvancedShareBtn = document.querySelector('.block-affin-always-hero-advanced a.text-white.ml-2.pt-3.pt-md-5');

    if (heroAdvancedShareBtn && lang === 'ms') {
        heroAdvancedShareBtn.innerHTML = 'Kongsi';
    }

    const shareButtonContainer = document.createElement('DIV');
    shareButtonContainer.className = 'share-block-container';
    shareButtonContainer.innerHTML = '<div id="shareBlock" class="d-none"></div>';

    if (heroAdvancedShareBtn) {
        heroAdvancedShareBtn.parentNode.insertBefore(shareButtonContainer, heroAdvancedShareBtn.nextSibling);
        heroAdvancedShareBtn.href = '#99';
        heroAdvancedShareBtn.style.textDecoration = 'none';
        heroAdvancedShareBtn.addEventListener('click', triggerHeroAdvancedShareButton);
    }

    const shareBlockContainer = document.querySelector('.block-affin-always-hero-advanced .share-block-container');
    if (shareBlockContainer) {
        shareBlockContainer.style.minHeight = '30px';
        shareBlockContainer.style.backgroundColor = '#FFFFFF';
        shareBlockContainer.style.width = 'fit-content';
        shareBlockContainer.style.borderRadius = '5px';
        shareBlockContainer.style.marginLeft = '50px';
        shareBlockContainer.style.position = 'absolute';
        shareBlockContainer.style.zIndex = '5';
    }

    const shareBlock = document.querySelector('.block-affin-always-hero-advanced #shareBlock');
    if (shareBlock) {
        shareBlock.style.padding = '5px';
    }
}

function triggerHeroAdvancedShareButton() {
    document.querySelector('.block-affin-always-hero-advanced #shareBlock').classList.remove('d-none');
    $('.block-affin-always-hero-advanced #shareBlock').cShare({
        showButtons: ['fb', 'whatsapp', 'twitter', 'email'],
        shareToText: 'Share to'
    });
    const shareThisBtn = document.querySelector('.block-affin-always-hero-advanced a.text-white.ml-2.pt-3.pt-md-5');
    if (shareThisBtn) {
        shareThisBtn.removeEventListener('click', triggerHeroAdvancedShareButton);

        shareThisBtn.addEventListener('click', function () {
            const shareBlock = document.querySelector('.block-affin-always-hero-advanced #shareBlock');
            if (shareBlock) {
                if (shareBlock.classList.contains('d-none')) {
                    shareBlock.classList.remove('d-none');
                } else {
                    shareBlock.classList.add('d-none');
                }
            }
        })
    }
}

/* Detect Hero Block With 'Share This' Button */
/* And Add Share Page Function */

/* Affin Always Slider */
// if (document.querySelector('.block-slider')) {
//     var slideIndex = 1;
//     showSlides(slideIndex);
// }

// function currentSlide(n) {
//     showSlides(slideIndex = n);
// }

// function showSlides(n) {
//     var i;
//     var slides = document.getElementsByClassName("my-slide");
//     var dots = document.getElementsByClassName("dot");
//     if (n > slides.length) {
//         slideIndex = 1
//     }
//     if (n < 1) {
//         slideIndex = slides.length
//     }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }
//     if (slides[slideIndex - 1] !== undefined) {
//         slides[slideIndex - 1].style.display = "block";
//     }
//     if (dots[slideIndex - 1] !== undefined) {
//         dots[slideIndex - 1].className += " active";
//     }
// }

/* Affin Always Slider */

/* Affin Group Slider */
// showSlide(slideIndex);

// function currentSlides(n) {
//     showSlide(slideIndex = n);
// }

// function showSlide(n) {
//     var i;
//     var slides = document.getElementsByClassName("slide");
//     var dots = document.getElementsByClassName("my-dot");
//     if (n > slides.length) {
//         slideIndex = 1
//     }
//     if (n < 1) {
//         slideIndex = slides.length
//     }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }
//     if (slides[slideIndex - 1] !== undefined) {
//         slides[slideIndex - 1].style.display = "block";
//     }
//     if (dots[slideIndex - 1] !== undefined) {
//         dots[slideIndex - 1].className += " active";
//     }
// }

/* Affin Group Slider */

/* A1addin Navbar */
function initializeA1addinNavbar() {
    setTimeout(function () {
        const desktopHamburgerMenuOverlay = document.querySelector('.block-a1addin-navbar #desktop-menu');
        if (desktopHamburgerMenuOverlay) {
            const desktopHamburgerMenu = document.querySelector('.block-a1addin-navbar #desktop-hamburger-menu');
            if (desktopHamburgerMenu) {
                desktopHamburgerMenu.addEventListener('click', function () {
                    desktopHamburgerMenuOverlay.style.maxHeight = '100%';
                });
            }

            const desktopHamburgerMenuCloseBtn = document.querySelector('.block-a1addin-navbar .close-desktop-menu-btn');
            if (desktopHamburgerMenuCloseBtn) {
                desktopHamburgerMenuCloseBtn.addEventListener('click', function () {
                    desktopHamburgerMenuOverlay.style.maxHeight = '0%';
                });
            }
        }

        const buttonIcon = document.getElementById('icon');
        const myTopnav = document.getElementById('myTopnav');
        if (buttonIcon) {
            buttonIcon.addEventListener('click', function () {
                if (myTopnav.className === 'topnav navbar-fixed-top affix responsive') {
                    myTopnav.className += ' responsive';
                    buttonIcon.className += ' active-close';
                } else {
                    myTopnav.className = 'topnav navbar-fixed-top affix';
                    buttonIcon.className = 'icon pt-5';
                }
            });
        }

        if (location.hostname === 'www.a1addin.com') {
            window.a1addinNavBar = document.getElementById('myTopnav');
            window.a1addinNavBarElement = document.querySelectorAll('.block-a1addin-navbar .pt-md-5.text-capitalize');
            window.a1addinNavBarLogo = document.getElementById('a1addin-logo');
            window.downloadButton = document.getElementById('btn-right');
            window.downloadButtonInMobileSize = document.getElementById('btn-bottom');
            window.affinWidget = document.getElementById('widget-gif');
            window.newA1addinAffinWidget = document.querySelector('.new-a1addin-chat-widget');
            window.a1addinLangBtn = document.querySelector('.block-a1addin-navbar .a1addin-lang-btn-desktop');
            window.desktopMenuIconBar = document.querySelectorAll('.block-a1addin-navbar .desktop-hamburger-menu .icon-bar');

            window.onresize = function () {
                if (screen.width < 991) {
                    a1addinNavBar.style.backgroundColor = '#ffffff';
                    a1addinNavBarLogo.src = '/img/a1addin-logo.png';
                    for (let index of a1addinNavBarElement) {
                        index.style.color = '#999999';
                    }
                    if (a1addinLangBtn) {
                        a1addinLangBtn.style.border = "1px solid #006EFF";
                        a1addinLangBtn.style.color = "#006EFF";
                        $(a1addinLangBtn).find("#a1addin-lang-icon").attr("src", "/img/globe-blue.svg");
                    }
                } else {
                    a1addinNavBar.style.backgroundColor = 'transparent';
                    a1addinNavBarLogo.src = '/img/a1addin-logo-white.png';
                    for (let index of a1addinNavBarElement) {
                        index.style.color = '#ffffff';
                    }
                    if (a1addinLangBtn) {
                        a1addinLangBtn.style.border = "1px solid #ffffff";
                        a1addinLangBtn.style.color = "#ffffff";
                        $(a1addinLangBtn).find("#a1addin-lang-icon").attr("src", "/img/globe-white.svg");
                    }
                }
            }
        }

        window.onscroll = function () {
            if (screen.width > 991) {
                checkNavbarStatus();
            } else {
                checkDownloadButtonStatus();
            }
        };

        function checkNavbarStatus() {
            if (location.hostname === 'www.a1addin.com') {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    if (a1addinNavBar) {
                        a1addinNavBar.style.backgroundColor = '#ffffff';
                    }
                    if (a1addinNavBarLogo) {
                        a1addinNavBarLogo.src = '/img/a1addin-logo.png';
                    }
                    if (affinWidget) {
                        affinWidget.src = '/img/faq-gif-blue.gif';
                    }
                    if (downloadButton) {
                        downloadButton.style.display = 'block';
                    }
                    if (a1addinNavBarElement) {
                        for (let index of a1addinNavBarElement) {
                            index.style.color = '#999999';
                        }
                    }
                    if (a1addinLangBtn) {
                        a1addinLangBtn.style.border = "1px solid #006EFF";
                        a1addinLangBtn.style.color = "#006EFF";
                        $(a1addinLangBtn).find("#a1addin-lang-icon").attr("src", "/img/globe-blue.svg");
                    }

                    if (desktopMenuIconBar) {
                        for (let index of desktopMenuIconBar) {
                            index.style.background = '#006EFF';
                        }
                    }
                } else {
                    if (a1addinNavBar) {
                        a1addinNavBar.style.backgroundColor = 'transparent';
                    }
                    if (a1addinNavBarLogo) {
                        a1addinNavBarLogo.src = '/img/a1addin-logo-white.png';
                    }
                    if (affinWidget) {
                        affinWidget.src = '/img/faq.gif';
                    }
                    if (downloadButton) {
                        downloadButton.style.display = 'none';
                    }
                    if (a1addinNavBarElement) {
                        for (let index of a1addinNavBarElement) {
                            index.style.color = '#ffffff';
                        }
                    }
                    if (a1addinLangBtn) {
                        a1addinLangBtn.style.border = "1px solid #ffffff";
                        a1addinLangBtn.style.color = "#ffffff";
                        $(a1addinLangBtn).find("#a1addin-lang-icon").attr("src", "/img/globe-white.svg");
                    }
                    if (desktopMenuIconBar) {
                        for (let index of desktopMenuIconBar) {
                            index.style.background = '#FFFFFF';
                        }
                    }
                }
            }
        }

        function checkDownloadButtonStatus() {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                if (downloadButtonInMobileSize) {
                    downloadButtonInMobileSize.style.display = 'block';
                    newA1addinAffinWidget.style.bottom = "90px";
                }
            } else {
                if (downloadButtonInMobileSize) {
                    downloadButtonInMobileSize.style.display = 'none';
                    newA1addinAffinWidget.style.bottom = "2%";
                }
            }
        }

        function makeNavbarModalOverflowHiddenWhenToggled() {
            let hamburgerBtn = document.querySelector(".block-a1addin-navbar #icon");
            let topNavbar = document.querySelector(".block-a1addin-navbar .topnav");

            if (!hamburgerBtn || !topNavbar) { return; }

            hamburgerBtn.addEventListener("click", function () {
                if ($(this).hasClass("active-close")) {
                    topNavbar.style.overflow = "unset";
                } else {
                    topNavbar.style.overflow = "hidden";
                }
            });
        }

        makeNavbarModalOverflowHiddenWhenToggled();
    }, 1000);
}

/* A1addin Navbar */

/* Affin Always Range */
if (document.querySelector('.block-affin-always-range') && document.getElementById("salary")) {
    document.getElementById("salary").value = 3000;
    drag();
}

function drag() {
    if (document.getElementById("salary").value !== null) {
        var x = document.getElementById("salary").value;
        document.getElementById("result").innerHTML = 'My salary is RM' + x;
    }
}

/* Affin Always Range */

/* Affin Always Navbar */
/* Modal */
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

if (btn) {
    btn.onclick = function () {
        modal.style.display = "block";
    }
}

if (span) {
    span.onclick = function () {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* Modal */

function openNav() {
    document.getElementById("myNav").style.height = "auto";
    document.getElementById("myNav").style.maxHeight = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.maxHeight = "0%";
}

/* Affin Always Navbar */

/* Affin Always OR A1addin Tab With Image */
if (document.querySelector('.block-a1addin-tabs-with-image') || document.querySelector('.block-tabs-with-image')) {
    setupTabsId();
    // changeTab("tab-link-1");
}

function setupTabsId() {
    var x = document.getElementsByClassName("twi-tab");
    for (i = 0; i < x.length; i++) {
        if (!x[i].classList.contains("tab-taken")) {
            x[i].style.display = "none";

            x[i].id = "tab-" + (i + 1);
            x[i].classList.add("tab-taken");

            if (x[i].id.replace("tab-", "") % 3 == 1) {
                x[i].style.display = "block";
            }
        }
    }

    var y = document.getElementsByClassName("tab-link-child");
    for (i = 0; i < y.length; i++) {
        if (!y[i].classList.contains("tab-taken")) {
            y[i].id = "tab-link-" + (i + 1);
            y[i].classList.add("tab-taken");
        }
    }
}

/* Tab A1addin*/
function changeTabA1addin(tabID) {
    if (!document.getElementById(tabID)) return;

    var x = document.getElementsByClassName("twi-tab");
    if (!x) return;

    var temp = tabID.replace("tab-link-", "");
    switch (temp % 2) {
        case 1: // tab 1
            x[temp].style.display = "none";
            break;
        case 0: // tab 2
        default:
            x[temp - 2].style.display = "none";
            break;
    }

    tabID = tabID.replace("tab-link-", "");
    document.getElementById("tab-" + tabID).style.display = "block";

    var y = document.getElementsByClassName("tab-link-child");
    toggleTabStyleA1addin(y, tabID);
}

function toggleTabStyleA1addin(array, toggleTab) {
    document.getElementById('tab-link-' + toggleTab).classList.add('active');
    switch (toggleTab % 2) {
        case 1: // tab 1
            array[toggleTab].classList.remove('active');
            break;
        case 0: // tab 2
        default:
            array[toggleTab - 2].classList.remove('active');
            break;
    }
}

/* Tab Affin Always*/
function changeTabAffinAlways(tabID) {
    if (!document.getElementById(tabID)) return;

    var x = document.getElementsByClassName("twi-tab");
    if (!x) return;

    var temp = tabID.replace("tab-link-", "");
    switch (temp % 3) {
        case 1: // tab 1
            x[temp].style.display = "none";
            x[++temp].style.display = "none";
            break;
        case 2: // tab 2
            x[temp - 2].style.display = "none";
            x[temp].style.display = "none";
            break;
        case 0: // tab 3
        default:
            x[temp - 3].style.display = "none";
            x[temp - 2].style.display = "none";
            break;
    }

    tabID = tabID.replace("tab-link-", "");
    document.getElementById("tab-" + tabID).style.display = "block";

    var y = document.getElementsByClassName("tab-link-child");
    toggleTabStyleAffinAlways(y, tabID);
}

function toggleTabStyleAffinAlways(array, toggleTab) {
    document.getElementById('tab-link-' + toggleTab).classList.add('active');
    switch (toggleTab % 3) {
        case 1: // tab 1
            array[toggleTab].classList.remove('active');
            array[++toggleTab].classList.remove('active');
            break;
        case 2: // tab 2
            array[toggleTab - 2].classList.remove('active');
            array[toggleTab].classList.remove('active');
            break;
        case 0: // tab 3
        default:
            array[toggleTab - 3].classList.remove('active');
            array[toggleTab - 2].classList.remove('active');
            break;
    }
}

/* Affin Always OR A1addin Tab With Image */

/* A1addin FAQ Multitab Questions */
// fetch('/currentLang')
//     .then(response => response.text())
//     .then(data => {
//         getFaqData(data);
//     });
// function getFaqData(lang) {
//     fetch('/json/faq/faq.json')
//         .then(response => response.json())
//         .then(data => {
//             for (let index of data) {
//                 let name;
//                 switch (lang) {
//                     case 'zh':
//                         name = index.name_in_chinese ? index.name_in_chinese : index.name_in_english;
//                         break;
//                     case 'ms':
//                         name = index.name_in_malay ? index.name_in_malay : index.name_in_english;
//                         break;
//                     case 'en':
//                     default:
//                         name = index.name_in_english;
//                         break;
//                 }
//                 let data = index.data;
//                 const div = document.createElement('LI');
//                 div.innerHTML = '<a href="#99" class="text-category">' + name + '</a>';
//                 div.className = 'categories ' + index.id;
//                 div.onclick = function () {
//                     switchTab(index.id);
//                 };
//
//                 const categoryDiv = document.querySelector("#category");
//                 if (categoryDiv) {
//                     categoryDiv.appendChild(div);
//                 }
//
//                 const questionsGroupDiv = document.createElement('DIV');
//                 questionsGroupDiv.id = index.id;
//                 questionsGroupDiv.className = 'tab tab-display-none'
//
//                 const questionsDiv = document.querySelector('#questions');
//                 if (questionsDiv) {
//                     questionsDiv.appendChild(questionsGroupDiv);
//                 }
//
//                 const tabId = '#' + index.id;
//
//                 for (let index of data) {
//                     let title;
//                     let content;
//                     switch (lang) {
//                         case 'zh':
//                             title = index.title_in_chinese ? index.title_in_chinese : index.title_in_english;
//                             content = index.content_in_chinese ? index.content_in_chinese : index.content_in_english;
//                             break;
//                         case 'ms':
//                             title = index.title_in_malay ? index.title_in_malay : index.title_in_english;
//                             content = index.content_in_malay ? index.content_in_malay : index.content_in_english;
//                             break;
//                         case 'en':
//                         default:
//                             title = index.title_in_english;
//                             content = index.content_in_english;
//                             break;
//                     }
//                     const div = document.createElement('DIV');
//                     div.innerHTML =
//                         '<div class="display-flow-root collapsible">' +
//                         '<p class="header-2 float-left">' + title + '</p>' +
//                         '<span class="header-2 float-right">+</span>' +
//                         '</div>' +
//                         '<div class="content">' +
//                         '<p class="text-description">' + content + '</p>' +
//                         '</div>' +
//                         '<hr>';
//                     div.className = 'py-2';
//                     div.onclick = () => {
//                         const coll = document.querySelectorAll('.collapsible');
//                         let i;
//
//                         if (coll) {
//                             for (i = 0; i < coll.length; i++) {
//                                 coll[i].addEventListener('click', function () {
//                                     const content = this.nextElementSibling;
//                                     if (content.style.maxHeight) {
//                                         content.style.maxHeight = null;
//                                     } else {
//                                         content.style.maxHeight = content.scrollHeight + 'px';
//                                     }
//                                 });
//                             }
//                         }
//                     }
//
//                     const questionsDiv = document.querySelector(tabId);
//                     if (questionsDiv) {
//                         questionsDiv.appendChild(div);
//                     }
//                 }
//             }
//             switchTab(data[0].id);
//         });
// }
//
// function switchTab(tabId) {
//     let i;
//     const questions = document.getElementsByClassName('tab-display-none');
//     if (questions) {
//         for (i = 0; i < questions.length; i++) {
//             questions[i].style.display = 'none';
//         }
//     }
//
//     let j;
//     const categories = document.getElementsByClassName('text-category');
//     if (categories) {
//         for (j = 0; j < categories.length; j++) {
//             categories[j].classList.remove('active');
//         }
//     }
//
//     let activeElement = document.getElementsByClassName(tabId)[0];
//     if (activeElement) {
//         activeElement = activeElement.firstElementChild;
//     }
//
//     const showElement = document.getElementById(tabId);
//
//     if (activeElement) {
//         activeElement.classList.add('active');
//     }
//
//     if (showElement) {
//         showElement.style.display = 'block';
//     }
// }

/* A1addin FAQ Multitab Questions */

/* Back To Top Button */
const backToTopButton = document.getElementById('back-to-top');

window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if (backToTopButton) {
            backToTopButton.style.display = 'block';
        }
    } else {
        if (backToTopButton) {
            backToTopButton.style.display = 'none';
        }
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/* Back To Top Button */

/* A1addin Terms & Conditions */
// function getTermsAndConditionsData(lang) {
//     fetch('/json/a1addin_tnc/a1addin_tnc.json')
//         .then(response => response.json())
//         .then(data => {
//             for (let index of data) {
//                 let termsAndConditionsList = index.data;
//                 for (let listData of termsAndConditionsList) {
//                     let title;
//                     let content;
//                     switch (lang) {
//                         case 'zh':
//                             title = listData.title_in_chinese ? listData.title_in_chinese : listData.title_in_english;
//                             content = listData.content_in_chinese ? listData.content_in_chinese : listData.content_in_english;
//                             break;
//                         case 'ms':
//                             title = listData.title_in_malay ? listData.title_in_malay : listData.title_in_english;
//                             content = listData.content_in_malay ? listData.content_in_malay : listData.content_in_english;
//                             break;
//                         case 'en':
//                         default:
//                             title = listData.title_in_english;
//                             content = listData.content_in_english;
//                             break;
//                     }
//                     const termsAndConditionsTabs = document.createElement('LI');
//                     termsAndConditionsTabs.innerHTML = '<a>' + title + '</a>';
//                     termsAndConditionsTabs.className = 'tnc-list-tabs ' + listData.id;
//                     termsAndConditionsTabs.onclick = function () {
//                         switchTncTab(listData.id);
//                     };
//
//                     const tncTab = document.querySelector('#tnc-tab');
//                     if (tncTab) {
//                         tncTab.appendChild(termsAndConditionsTabs);
//                     }
//
//                     const termsAndConditionsContent = document.createElement('DIV');
//                     termsAndConditionsContent.innerHTML =
//                         '<h3>' + title + '</h3>' +
//                         '<p>' + content + '</p>';
//                     termsAndConditionsContent.id = listData.id;
//                     termsAndConditionsContent.className = 'details tab-display-none fade';
//
//                     const tncContent = document.querySelector('#tnc-content');
//                     if (tncContent) {
//                         tncContent.appendChild(termsAndConditionsContent);
//                     }
//                 }
//             }
//             switchTncTab(data[0].data[0].id);
//         });
// }
//
// function switchTncTab(tabId) {
//     let i;
//     const tnc = document.getElementsByClassName('tab-display-none');
//     if (tnc) {
//         for (i = 0; i < tnc.length; i++) {
//             tnc[i].classList.remove('in');
//         }
//     }
//
//     let j;
//     const tncListTabs = document.getElementsByClassName('tnc-list-tabs');
//     if (tncListTabs) {
//         for (j = 0; j < tncListTabs.length; j++) {
//             tncListTabs[j].classList.remove('active');
//         }
//     }
//
//     const activeElement = document.getElementsByClassName(tabId)[0];
//     if (activeElement) {
//         activeElement.classList.add('active');
//     }
//
//     const showElement = document.getElementById(tabId);
//     if (showElement) {
//         showElement.classList.add('in');
//     }
// }

/* A1addin Terms & Conditions */

/* A1addin Security Awareness */
// fetch('/currentLang')
//     .then(response => response.text())
//     .then(lang => {
//         getSecurityAwarenessData(lang, '<?= $block->setting('source') ?>');
//     });

// TODO: it seems won't affect the security awareness blocks by commenting the following code out
// const nextBtn = document.getElementById('btn-next');
// if (nextBtn) {
//     nextBtn.addEventListener('click', nextPage);
// }

// const prevBtn = document.getElementById('btn-prev');
// if (prevBtn) {
//     prevBtn.addEventListener('click', prevPage);
// }

// let currentPage = 1;
// const recordsPerPage = 4;

// async function getSecurityAwarenessData(lang) {
//     await fetch('/json/security_awareness/security_awareness.json')
//         .then(response => response.json())
//         .then(data => {
//             window.objJson = data[0].data;
//         });
//     changePage(1, lang);
//     for (let i = 0; i < numPages(); i++) {
//         const pageBtn = document.createElement('SPAN');
//         pageBtn.className = 'page-button';
//         pageBtn.innerHTML = (i + 1).toString();
//         pageBtn.id = (i + 1).toString();
//         pageBtn.onclick = function () {
//             changePage(i + 1, lang);
//         };
//
//         const btnGroup = document.querySelector('#pages-buttons');
//         if (btnGroup) {
//             btnGroup.appendChild(pageBtn);
//         }
//     }
// }
//
// function prevPage() {
//     if (currentPage > 1) {
//         currentPage--;
//         changePage(currentPage);
//     }
// }
//
// function nextPage() {
//     if (currentPage < numPages()) {
//         currentPage++;
//         changePage(currentPage);
//     }
// }
//
// function changePage(page, lang) {
//     let i;
//     const buttons = document.getElementsByClassName('page-button');
//     if (buttons) {
//         for (i = 0; i < buttons.length; i++) {
//             buttons[i].style.backgroundColor = '#fff';
//         }
//     }
//
//     const activeBtn = document.getElementById(page);
//     if (activeBtn) {
//         activeBtn.style.backgroundColor = '#f6f6f6';
//     }
//     const listingTable = document.getElementById("listingTable");
//
//     // Validate page
//     if (page < 1) page = 1;
//     if (page > numPages()) page = numPages();
//
//     if (listingTable) {
//         listingTable.innerHTML = "";
//     }
//
//     for (let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) && i < objJson.length; i++) {
//         let title;
//         let content;
//         let image;
//         switch (lang) {
//             case 'zh':
//                 title = objJson[i].title_in_chinese ? objJson[i].title_in_chinese : objJson[i].title_in_english;
//                 content = objJson[i].subtitle_in_chinese ? objJson[i].subtitle_in_chinese : objJson[i].subtitle_in_english;
//                 image = objJson[i].img_in_chinese ? objJson[i].img_in_chinese : objJson[i].img_in_english;
//                 break;
//             case 'ms':
//                 title = objJson[i].title_in_malay ? objJson[i].title_in_malay : objJson[i].title_in_english;
//                 content = objJson[i].subtitle_in_malay ? objJson[i].subtitle_in_malay : objJson[i].subtitle_in_english;
//                 image = objJson[i].img_in_malay ? objJson[i].img_in_malay : objJson[i].img_in_english;
//                 break;
//             case 'en':
//             default:
//                 title = objJson[i].title_in_english;
//                 content = objJson[i].subtitle_in_english;
//                 image = objJson[i].img_in_english;
//                 break;
//         }
//
//         const cardElement = document.createElement('DIV');
//         cardElement.innerHTML =
//             '<a href="' + objJson[i].url + '">' +
//             '<div id="wow" class="grey-container">' +
//             '<img src="' + image + '" class="image">' +
//             '<h4 style="font-weight:bold"><strong>' + title + '</strong></h4>' +
//             '<p class="pfont">' + content + '</p>' +
//             '</div>' +
//             '</a>';
//         cardElement.className = 'col-md-6';
//
//         const cards = document.querySelector('#listingTable');
//         if (cards) {
//             cards.appendChild(cardElement);
//         }
//     }
//
//     if (page === 1) {
//         prevBtn.style.visibility = "hidden";
//     } else {
//         prevBtn.style.visibility = "visible";
//     }
//
//     if (page === numPages()) {
//         nextBtn.style.visibility = "hidden";
//     } else {
//         nextBtn.style.visibility = "visible";
//     }
// }
//
// function numPages() {
//     return Math.ceil(window.objJson.length / recordsPerPage);
// }

/* A1addin Security Awareness */

/* A1addin Privacy Notice */
// function getPrivacyNoticeData(lang) {
//     fetch('/json/privacy_notices/privacy_notices.json')
//         .then(response => response.json())
//         .then(data => {
//             for (let index of data) {
//                 let privacyNoticeList = index.data;
//                 for (let listData of privacyNoticeList) {
//                     let title;
//                     let content;
//                     switch (lang) {
//                         case 'zh':
//                             title = listData.title_in_chinese ? listData.title_in_chinese : listData.title_in_english;
//                             content = listData.content_in_chinese ? listData.content_in_chinese : listData.content_in_english;
//                             break;
//                         case 'ms':
//                             title = listData.title_in_malay ? listData.title_in_malay : listData.title_in_english;
//                             content = listData.content_in_malay ? listData.content_in_malay : listData.content_in_english;
//                             break;
//                         case 'en':
//                         default:
//                             title = listData.title_in_english;
//                             content = listData.content_in_english;
//                             break;
//                     }
//                     const privacyNoticeTabs = document.createElement('LI');
//                     privacyNoticeTabs.innerHTML = '<a>' + title + '</a>';
//                     privacyNoticeTabs.className = 'privacy-notice-list-tabs ' + listData.id;
//                     privacyNoticeTabs.onclick = function () {
//                         switchPrivacyNoticeTab(listData.id);
//                     };
//
//                     const privacyNoticeTab = document.querySelector('#privacy-notice-tab');
//                     if (privacyNoticeTab) {
//                         privacyNoticeTab.appendChild(privacyNoticeTabs);
//                     }
//
//                     const privacyNoticeContent = document.createElement('DIV');
//                     privacyNoticeContent.innerHTML =
//                         '<h3>' + title + '</h3>' +
//                         '<p>' + content + '</p>';
//                     privacyNoticeContent.id = listData.id;
//                     privacyNoticeContent.className = 'details tab-display-none fade';
//
//                     const noticeContent = document.querySelector('#privacy-notice-content');
//                     if (noticeContent) {
//                         noticeContent.appendChild(privacyNoticeContent);
//                     }
//                 }
//             }
//             switchPrivacyNoticeTab(data[0].data[0].id);
//         });
// }
//
// function switchPrivacyNoticeTab(tabId) {
//     let i;
//     const privacyNotice = document.getElementsByClassName('tab-display-none');
//     if (privacyNotice) {
//         for (i = 0; i < privacyNotice.length; i++) {
//             privacyNotice[i].classList.remove('in');
//         }
//     }
//
//     let j;
//     const privacyNoticeListTabs = document.getElementsByClassName('privacy-notice-list-tabs');
//     if (privacyNoticeListTabs) {
//         for (j = 0; j < privacyNoticeListTabs.length; j++) {
//             privacyNoticeListTabs[j].classList.remove('active');
//         }
//     }
//
//     const activeElement = document.getElementsByClassName(tabId)[0];
//     if (activeElement) {
//         activeElement.classList.add('active');
//     }
//
//     const showElement = document.getElementById(tabId);
//     if (showElement) {
//         showElement.classList.add('in');
//     }
// }

// ready(function(){

//     $('script#genesys-js').remove();

//     if (location.hostname === 'www.a1addin.com') {

//         var imported = $('<script>').attr({'id':'genesys-js',
//         'src' :'https://gms.a1addin.com/cobrowse/js/gcb.min.js',
//         'data-gcb-url' : 'https://gms.a1addin.com/cobrowse',
//         'data-gwc-var': '_genesys.chat'});
//         $('head').append(imported);
//     }

//     if (location.hostname === 'www.affinalways.com') {

//         var imported = $('<script>').attr({'id':'genesys-js',
//         'src' :'https://gms.affinalways.com/cobrowse/js/gcb.min.js',
//         'data-gcb-url' : 'https://gms.affinalways.com/cobrowse',
//         'data-gwc-var': '_genesys.chat'});
//         $('head').append(imported);

//     }

//     console.log($('script#genesys-js'));
// })

/* A1addin Privacy Notice */


// TODO: temporary fix for affin chat logo in a1addin

ready(function () {

    // if(location.pathname == 'blank' && location.origin == null && location.href == 'about:blank'){
    //dont create

    // }

    $('script#genesys-js').remove();

    if (location.hostname === 'www.a1addin.com' && location.href != 'about:blank') {

        $("#affin_launch_widget").hide(); //hide the default old chat widget

        var chat_button = $('<a>').attr({
            'href': '#',
            'id': 'affin_launch_widget',
            'onclick': 'launch_widget()',
            'class': 'new-a1addin-chat-widget'
        }).append(
            $('<img>').attr({ 'src': '/img/affin-always-live-chat/girl.png', 'id': 'widget-gif' }),
            $('<p>').text('AffinChat'),
        );
        var imported = $('<script>').attr({
            'id': 'genesys-js',
            'src': '/widgets/gcb.min.js',
            'data-gcb-url': 'https://gms.a1addin.com/cobrowse',
            'data-gwc-var': '_genesys.chat'
        });

        $('body').append(imported, chat_button);

        // if(window.matchMedia("(max-width: 664px)").matches){
        //     $(".new-a1addin-chat-widget").hide();
        // } else {
        //     $(".new-a1addin-chat-widget").show();
        // }
    }

    if (location.hostname === 'www.affinalways.com' && location.href != 'about:blank') {

        var chat_button = $('<a>').attr({
            'href': '#',
            'id': 'affin_launch_widget',
            'onclick': 'launch_widget()'
        }).append(
            $('<img>').attr({ 'src': '/img/affin-always-live-chat/girl.png', 'id': 'widget-gif' }),
            $('<p>').text('AffinChat'),
        );
        var imported = $('<script>').attr({
            'id': 'genesys-js',
            'src': '/widgets/gcb.min.js',
            'data-gcb-url': 'https://gms.affinalways.com/cobrowse',
            'data-gwc-var': '_genesys.chat'
        });

        $('body').append(imported, chat_button);

    }

});

function launch_widget() {
    $(".cx-sidebar-button").trigger("click");
}

// TODO: Insert GA and FB Pixel Script for three different domain

if (location.hostname !== '' && location.hostname !== null && location.href !== 'about:blank') {

    // Remove draggable attribute to make content able to be copied
    $("*").removeAttr("draggable");

    let gaId, fbPixelId;
    if (location.hostname === 'www.a1addin.com') {
        gaId = 'G-0P1H4DNMLP';
        fbPixelId = '590805125357654';

        // Second A1addin Google and FB Pixel tag
        const a1addinFbPixelScript = document.createElement('script');
        a1addinFbPixelScript.innerHTML = '!function(f,b,e,v,n,t,s)\n' +
            '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n' +
            'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n' +
            'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\n' +
            'n.queue=[];t=b.createElement(e);t.async=!0;\n' +
            't.src=v;s=b.getElementsByTagName(e)[0];\n' +
            's.parentNode.insertBefore(t,s)}(window, document,\'script\',\n' +
            '\'https://connect.facebook.net/en_US/fbevents.js\');\n' +
            'fbq(\'init\', \'2736782109903279\');\n' +
            'fbq(\'track\', \'PageView\');\n';

        const a1addinFbPixelNoscript = document.createElement('noscript');
        a1addinFbPixelNoscript.innerHTML = '<img height="1" width="1" style="display:none"\n' +
            'src="https://www.facebook.com/tr?id=2736782109903279&ev=PageView&noscript=1"\n' +
            '/>';

        document.head.appendChild(a1addinFbPixelScript);
        document.head.appendChild(a1addinFbPixelNoscript);

        const a1addinGaTagScript1 = document.createElement("script");
        a1addinGaTagScript1.src = 'https://www.googletagmanager.com/gtag/js?id=AW-316025817';

        const a1addinGaTagScript2 = document.createElement("script");
        a1addinGaTagScript2.innerHTML = 'window.dataLayer = window.dataLayer || [];\n' +
            '  function gtag(){dataLayer.push(arguments);}\n' +
            '  gtag(\'js\', new Date());\n' +
            '  gtag(\'config\', \'AW-316025817\');\n';

        const a1addinGaTagScript3 = document.createElement('script');
        a1addinGaTagScript3.innerHTML = 'gtag(\'event\', \'conversion\', {\'send_to\': \'AW-316025817/vGdsCM_MleoCENnX2JYB\'});';

        document.head.appendChild(a1addinGaTagScript1);
        document.head.appendChild(a1addinGaTagScript2);
        document.head.appendChild(a1addinGaTagScript3);
    } else if (location.hostname === 'www.affinalways.com') {
        gaId = 'G-E4C0ZS8CEV';
        fbPixelId = '1220157555143449';
    } else if (location.hostname === 'www.affingroup.com') {
        gaId = 'G-VHVJ6N3H3C';
        fbPixelId = '603598110886551';
    }

    // <!-- Global site tag (gtag.js) - Google Analytics -->
    const gaTagscript1 = document.createElement("script");
    gaTagscript1.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;

    const gaTagscript2 = document.createElement("script");
    gaTagscript2.innerHTML = 'window.dataLayer = window.dataLayer || [];' +
        'function gtag(){dataLayer.push(arguments);}' +
        'gtag(\'js\', new Date());' +
        'gtag(\'config\', \'' + gaId + '\');';

    document.head.appendChild(gaTagscript1);
    document.head.appendChild(gaTagscript2);
    // <!-- End Global site tag (gtag.js) - Google Analytics -->

    // <!-- Facebook Pixel Code -->
    const fbPixelScript = document.createElement('script');
    fbPixelScript.innerHTML = '!function(f,b,e,v,n,t,s)\n' +
        '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n' +
        'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n' +
        'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\n' +
        'n.queue=[];t=b.createElement(e);t.async=!0;\n' +
        't.src=v;s=b.getElementsByTagName(e)[0];\n' +
        's.parentNode.insertBefore(t,s)}(window, document,\'script\',\n' +
        '\'https://connect.facebook.net/en_US/fbevents.js\');\n' +
        'fbq(\'init\', \'' + fbPixelId + '\');\n' +
        'fbq(\'track\', \'PageView\');';

    const fbPixelNoscript = document.createElement('noscript');
    fbPixelNoscript.innerHTML = '<img height="1" width="1" style="display:none"\n' +
        'src="https://www.facebook.com/tr?id=' + fbPixelId + '&ev=PageView&noscript=1"\n' +
        '/>';

    document.head.appendChild(fbPixelScript);
    document.head.appendChild(fbPixelNoscript);
    // <!-- End Facebook Pixel Code -->

    // Start FB Page View Pixel
    const fbPageViewPixelScript = document.createElement('script');
    fbPageViewPixelScript.innerHTML = '!function(f,b,e,v,n,t,s)\n' +
        '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n' +
        'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n' +
        'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\n' +
        'n.queue=[];t=b.createElement(e);t.async=!0;\n' +
        't.src=v;s=b.getElementsByTagName(e)[0];\n' +
        's.parentNode.insertBefore(t,s)}(window, document,\'script\',\n' +
        '\'https://connect.facebook.net/en_US/fbevents.js\');\n' +
        'fbq(\'init\', \'2736782109903279\');\n' +
        'fbq(\'track\', \'PageView\');\n';

    const fbPageViewPixelNoScript = document.createElement('noscript');
    fbPageViewPixelNoScript.innerHTML = '><img height="1" width="1" style="display:none"\n' +
        'src="https://www.facebook.com/tr?id=2736782109903279&ev=PageView&noscript=1"\n' +
        '/>';

    document.head.appendChild(fbPageViewPixelScript);
    document.head.appendChild(fbPageViewPixelNoScript);
    // End FB Page View Pixel
}

function loadFile() {
    const scriptTag = document.createElement("script"),
        filePath = "/themes/demo/js/gtag.js";

    scriptTag.type = "text/javascript";
    scriptTag.src = filePath;

    document.getElementsByTagName("head")[0].appendChild(scriptTag);
}

if (document.querySelector('.block-affin-always-info-boxes-list-with-icons')) {
    const coll = document.querySelectorAll('.block-affin-always-info-boxes-list-with-icons .collapsible');
    let i;

    if (coll) {
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    }
}

function externalLinkDisclaimerTextBM(lang) {
    if (location.hostname !== '' && location.hostname !== null && location.href !== 'about:blank') {
        const externalLinkDisclaimerText = document.querySelector('#dialog-confirm');
        if (externalLinkDisclaimerText && lang === 'ms') {
            externalLinkDisclaimerText.setAttribute('title', 'Penafian Pautan Luar');
            if (location.hostname === 'www.a1addin.com' || location.hostname === 'staging.a1addin.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan A1addin.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            } else if (location.hostname === 'www.affinalways.com' || location.hostname === 'staging.affinalways.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan AffinAlways.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            } else if (location.hostname === 'www.affingroup.com' || location.hostname === 'staging.affingroup.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan AffinGroup.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            }
        } else {
            if (location.hostname === 'www.a1addin.com' || location.hostname === 'staging.a1addin.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving A1addin.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK’s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            } else if (location.hostname === 'www.affinalways.com' || location.hostname === 'staging.affinalways.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving AffinAlways.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK’s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            } else if (location.hostname === 'www.affingroup.com' || location.hostname === 'staging.affingroup.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving AffinGroup.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK’s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            }
        }
    }
}

function a1addinCopyrightInBM(lang) {
    if (location.hostname !== '' && location.hostname !== null && location.href !== 'about:blank') {
        if (lang === 'ms' && (location.hostname === 'www.a1addin.com' || location.hostname === 'staging.a1addin.com')) {
            const msDownloadNowSection = document.querySelector('.block-a1addin-download-links.a1addin-download-now-ms');
            if (msDownloadNowSection) {
                msDownloadNowSection.setAttribute('id', 'download-ms');
            }

            const desktopDownloadButton = document.querySelector('.block-a1addin-navbar .download-button-in-desktop-size');
            if (desktopDownloadButton) {
                desktopDownloadButton.setAttribute('href', '#download-ms');
                desktopDownloadButton.innerHTML = '<span class="glyphicon glyphicon-cloud-download"></span> Muat turun A1addin sekarang!';
            }

            const mobileDownloadButton = document.querySelector('.block-a1addin-navbar .download-button-in-mobile-size');
            if (mobileDownloadButton) {
                mobileDownloadButton.setAttribute('href', '#download-ms');
                mobileDownloadButton.innerHTML = '<span class="glyphicon glyphicon-cloud-download"></span> Muat turun A1addin sekarang!';
            }

            const copyrightText = document.querySelector('.block-a1addin-footer .text-center.text-grey');
            if (copyrightText) {
                copyrightText.innerHTML = 'Hakcipta Terpelihara 2019 Affin Bank Berhad (25046-T)<br>Paparan terbaik menggunakan versi terkini Chrome, Firefox, Edge dan Safari.';
            }

            setTimeout(function () {
                const footerUrl = document.querySelectorAll('.block-a1addin-footer .text-capitalize.text-grey');
                if (footerUrl) {
                    footerUrl[0].innerHTML = 'Kesedaran Sekuriti';
                    footerUrl[0].href = '/bm/security-awareness';
                    footerUrl[1].innerHTML = 'Piagam Perkhidmatan Pelanggan';
                    footerUrl[1].href = 'https://www.a1addin.com/storage/PDF%20Attachments/Others/Client-Charter-BM.pdf';
                    footerUrl[2].innerHTML = 'Piagam Layanan Adil dan Saksama Kepada Pelanggan';
                    footerUrl[2].href = '/bm/treat-customer-fairly-charter';
                    footerUrl[3].innerHTML = 'Notis Privasi';
                    footerUrl[3].href = '/bm/privacy-notice';
                    footerUrl[4].innerHTML = 'Terma & Syarat';
                    footerUrl[4].href = '/bm/terms-conditions';
                }
            }, 1000);
        }
    }
}

/*function appendChatbotScript() {
    const chatbotScript = document.createElement('script');
    chatbotScript.innerHTML = `window.ymConfig = { bot: 'x1665396635536', host: 'https://amigoitsolutions.com' }; (function () {var w=window,ic=w.YellowMessenger;if("function"===typeof ic)ic("reattach_activator"),ic("update",ymConfig);else{var d=document,i=function(){i.c(arguments)};function l(){var e=d.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://cdn.yellowmessenger.com/plugin/widget-v2/latest/dist/main.min.js";var t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}i.q=[],i.c=function(e){i.q.push(e)},w.YellowMessenger=i,w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}})();`;

    document.head.appendChild(chatbotScript);
}*/
/* Affin Always Slider */
// if (document.querySelector('.block-slider')) {
//     var slideIndex = 1;
//     showSlides(slideIndex);
// }

// function currentSlide(n) {
//     showSlides(slideIndex = n);
// }

// function showSlides(n) {
//     var i;
//     var slides = document.getElementsByClassName("my-slide");
//     var dots = document.getElementsByClassName("dot");
//     if (n > slides.length) {
//         slideIndex = 1
//     }
//     if (n < 1) {
//         slideIndex = slides.length
//     }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         // dots[i].className = dots[i].className.replace(" active", "");
//         dots[i].classList.remove('active');
//     }
//     if (slides[slideIndex - 1] !== undefined) {
//         slides[slideIndex - 1].style.display = "block";
//     }
//     if (dots[slideIndex - 1] !== undefined) {
//         // dots[slideIndex - 1].className += " active";
//         dots[slideIndex - 1].classList.add('active');
//     }
// }

/* Affin Always Slider */

if (document.querySelector('.block-affin-always-range') && document.getElementById("salary")) {
    document.getElementById("salary").value = 3000;
    drag();
}

function drag() {
    if (document.getElementById("salary").value !== null) {
        var x = document.getElementById("salary").value;
        document.getElementById("result").innerHTML = 'My salary is RM' + x;
    }
}

function carouselYmal() {
    let blocks = document.querySelectorAll('.block-you-may-also-like');

    for (let i = 0; i < blocks.length; i++) {
        yMALScope(i);
    }

    function yMALScope(index) {
        var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo 5";
        let items = blocks[index].getElementsByClassName(itemClassName);

        let totalItems = items.length;
        let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
        let slideLeft;
        let slideRight;

        // Set previous, active and next images (minimum of 3 images)
        function setClasses(previous, firstActive, next) {
            if (items[previous]) items[previous].className = itemClassName + " prev";
            if (items[firstActive]) items[firstActive].className = itemClassName + " active";

            for (let i = 1; i < activeSlides; i++) {
              if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
            }

            if (items[next]) items[next].className = itemClassName + " next";
        }

        // Set event listeners
        function setEventListeners() {
            var next = blocks[index].getElementsByClassName('carousel__button--next-5')[0],
            prev = blocks[index].getElementsByClassName('carousel__button--prev-5')[0];

            if (next) {
                next.addEventListener('click', moveNext);
            }

            if (prev) {
                prev.addEventListener('click', movePrev);
            }
        }

        // Next navigation handler
        function moveNext() {
            //if right-most slide has reached end of carousel, reset carousel to start
            if (slideRight === (totalItems - 1)) {
                slideLeft = 0;

              //else right-shift carousel based on number of slides remaining until end
            } else {
                // var slidesRemaining = totalItems - 1;
                // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
                slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
            }

            //show/hide button based on scrollable
            $('.carousel__button--prev-5', blocks[index]).show();

            if (totalItems - activeSlides === slideLeft) {
                $('.carousel__button--next-5', blocks[index]).hide();
            } else {
                $('.carousel__button--next-5', blocks[index]).show();
            }

            moveCarouselTo(slideLeft);
        }

        // Previous navigation handler
        function movePrev() {
            //if left-most slide has reached start of carousel, reset carousel to end
            if (slideLeft === 0) {
                slideLeft = (totalItems - activeSlides);

                //left-shift carousel based on number of slides remaining until start
            } else {
                slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
            }

            //show/hide button based on scrollable
            $('.carousel__button--next-5', blocks[index]).show();

            if (slideLeft === 0) {
                $('.carousel__button--prev-5', blocks[index]).hide();
            } else {
                $('.carousel__button--prev-5', blocks[index]).show();
            }

            moveCarouselTo(slideLeft);
        }

        function moveCarouselTo(slideLeft) {
            slideRight = slideLeft + activeSlides - 1;

            //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
            var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;

            //next slide is always 1 slide after right-most slide, unless right-most slide is at end
            var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

            //reset images to default classes
            for (let item of items) {
                item.className = itemClassName;
            }

            //set new previous, active and next images
            setClasses(newPrevious, slideLeft, newNext);
        }

        function initCarousel() {
            // Hide buttons if less than 3 items
            if (totalItems <= 3) {
                $('.carousel__button--next-5', blocks[index]).hide();
                $('.carousel__button--prev-5', blocks[index]).hide();
                // TODO: not sure why need to return, comment it out to let if it is less than 3 if will still show
                // return;
            } else {
                $('.carousel__button--prev-5', blocks[index]).hide();
                $('.carousel__button--next-5', blocks[index]).show();

                // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
                if (activeSlides === 1 && totalItems > 1 || activeSlides === 2 && totalItems > 2) {
                    $('.carousel__button--next-5', blocks[index]).show();
                }
            }
            setClasses(totalItems - 1, 0, activeSlides);
            //setInitialClasses();
            // Set moving to false so that the carousel becomes interactive
            moving = false;
        }


        // TODO: make a better checker or function if possible
        function mediaSizeChecker() {
            var mobile = window.matchMedia("(max-width: 767px)");
            var tablet = window.matchMedia("(max-width: 1023px)");

            if (mobile.matches) { // If media query matches
                activeSlides = 1;
                slideLeft = 0;
                slideRight = slideLeft + activeSlides - 1;
            } else if (tablet.matches) {
                activeSlides = 2;
                slideLeft = 0;
                slideRight = slideLeft + activeSlides - 1;
            } else {
                activeSlides = 3;
                slideLeft = 0;
                slideRight = slideLeft + activeSlides - 1;
            }
        }

        window.addEventListener('resize', function () {
            mediaSizeChecker();
            initCarousel();
        });

        mediaSizeChecker();
        initCarousel();
        setEventListeners();
    }
}

if (document.querySelector('.block-you-may-also-like')) {
    carouselYmal();
}

function carouselYmal3() {
  let blocks = document.querySelectorAll('.block-you-may-also-like');

    for (let i = 0; i < blocks.length; i++) {
        yMALScope3(i);
    }

    function yMALScope3(index) {
      var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo-3";
      let items = blocks[index].getElementsByClassName(itemClassName);

      let totalItems = items.length;
      let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
      let slideLeft;
      let slideRight;

      // Set previous, active and next images (minimum of 3 images)
      function setClasses(previous, firstActive, next) {
        if (items[previous]) items[previous].className = itemClassName + " prev";
        if (items[firstActive]) items[firstActive].className = itemClassName + " active";
        for (let i = 1; i < activeSlides; i++) {
          if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
        }
        if (items[next]) items[next].className = itemClassName + " next";
      }

      // Set event listeners
      function setEventListeners() {
        var next = blocks[index].getElementsByClassName('carousel__button--next-3')[0],
          prev = blocks[index].getElementsByClassName('carousel__button--prev-3')[0];
        if (next) {
          next.addEventListener('click', moveNext);
        }

        if (prev) {
          prev.addEventListener('click', movePrev);
        }
      }

      // Next navigation handler
      function moveNext() {
        //if right-most slide has reached end of carousel, reset carousel to start
        if (slideRight === (totalItems - 1)) {
          slideLeft = 0;

          //else right-shift carousel based on number of slides remaining until end
        } else {
          // var slidesRemaining = totalItems - 1;
          // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
          slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
        }

        //show/hide button based on scrollable
        $('.carousel__button--prev-3', blocks[index]).show();

        if (totalItems - activeSlides === slideLeft) {
          $('.carousel__button--next-3', blocks[index]).hide();
        } else {
          $('.carousel__button--next-3', blocks[index]).show();
        }


        moveCarouselTo(slideLeft);
      }

      // Previous navigation handler
      function movePrev() {
        //if left-most slide has reached start of carousel, reset carousel to end
        if (slideLeft === 0) {
          slideLeft = (totalItems - activeSlides);

          //left-shift carousel based on number of slides remaining until start
        } else {
          slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
        }

        //show/hide button based on scrollable
        $('.carousel__button--next-3', blocks[index]).show();

        if (slideLeft === 0) {
          $('.carousel__button--prev-3', blocks[index]).hide();
        } else {
          $('.carousel__button--prev-3', blocks[index]).show();
        }

        moveCarouselTo(slideLeft);
      }

      function moveCarouselTo(slideLeft) {

        slideRight = slideLeft + activeSlides - 1;

        //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
        var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;

        //next slide is always 1 slide after right-most slide, unless right-most slide is at end
        var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

        //reset images to default classes
        for (let item of items) {
          item.className = itemClassName;
        }

        //set new previous, active and next images
        setClasses(newPrevious, slideLeft, newNext);
      }

      function initCarousel() {
        // Hide buttons if less than 3 items
        if (totalItems < 3) {
          $('.carousel__button--next-3', blocks[index]).hide();
          $('.carousel__button--prev-3', blocks[index]).hide();
          // TODO: not sure why need to return, comment it out to let if it is less than 3 if will still show
          // return;
        } else {
          $('.carousel__button--prev-3', blocks[index]).hide();
          $('.carousel__button--next-3', blocks[index]).hide();

          // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
          if (activeSlides == 1 && totalItems > 1 || activeSlides == 2 && totalItems > 2) {
            $('.carousel__button--next-3', blocks[index]).show();
          }
        }
        setClasses(totalItems - 1, 0, activeSlides);
        //setInitialClasses();
        
        // Set moving to false so that the carousel becomes interactive
        moving = false;
      }


      // TODO: make a better checker or function if possible
      function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        if (mobile.matches) { // If media query matches
          activeSlides = 1;
          slideLeft = 0;
          slideRight = slideLeft + activeSlides - 1;
        } else if (tablet.matches) {
          activeSlides = 2;
          slideLeft = 0;
          slideRight = slideLeft + activeSlides - 1;
        } else {
          activeSlides = 3;
          slideLeft = 0;
          slideRight = slideLeft + activeSlides - 1;
        }
      }

      window.addEventListener('resize', function () {
        mediaSizeChecker();
        initCarousel();
      });

      mediaSizeChecker();
      initCarousel();
      setEventListeners();
    }
}

if (document.querySelector('.block-you-may-also-like')) {
    carouselYmal3();
}

function carouselYmal4() {
    let blocks = document.querySelectorAll('.block-you-may-also-like');

    for (let i = 0; i < blocks.length; i++) {
        yMALScope4(i);
    }

    function yMALScope4(index) {
        var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo 4";
        let items = blocks[index].getElementsByClassName(itemClassName);
      
        let totalItems = items.length;
        let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
        let slideLeft;
        let slideRight;
      
        // Set previous, active and next images (minimum of 3 images)
        function setClasses(previous, firstActive, next) {
          if (items[previous]) items[previous].className = itemClassName + " prev";
          if (items[firstActive]) items[firstActive].className = itemClassName + " active";
          for (let i = 1; i < activeSlides; i++) {
            if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
          }
          if (items[next]) items[next].className = itemClassName + " next";
        }
      
        // Set event listeners
        function setEventListeners() {
          var next = blocks[index].getElementsByClassName('carousel__button--next-4')[0],
            prev = blocks[index].getElementsByClassName('carousel__button--prev-4')[0];
          if (next) {
              next.addEventListener('click', moveNext);
          }
          if (prev) {
              prev.addEventListener('click', movePrev);
          }
        }
      
        // Next navigation handler
        function moveNext() {
          //if right-most slide has reached end of carousel, reset carousel to start
          if (slideRight === (totalItems - 1)) {
            slideLeft = 0;
      
            //else right-shift carousel based on number of slides remaining until end
          } else {
            // var slidesRemaining = totalItems - 1;
            // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
            slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
          }
      
          //show/hide button based on scrollable
          $('.carousel__button--prev-4', blocks[index]).show();
      
          if (totalItems - activeSlides === slideLeft) {
            $('.carousel__button--next-4', blocks[index]).hide();
          } else {
            $('.carousel__button--next-4', blocks[index]).show();
          }
      
      
          moveCarouselTo(slideLeft);
        }
      
        // Previous navigation handler
        function movePrev() {
          //if left-most slide has reached start of carousel, reset carousel to end
          if (slideLeft === 0) {
            slideLeft = (totalItems - activeSlides);
      
            //left-shift carousel based on number of slides remaining until start
          } else {
            slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
          }
      
          //show/hide button based on scrollable
          $('.carousel__button--next-4', blocks[index]).show();
      
          if (slideLeft === 0) {
            $('.carousel__button--prev-4', blocks[index]).hide();
          } else {
            $('.carousel__button--prev-4', blocks[index]).show();
          }
      
          moveCarouselTo(slideLeft);
        }
      
        function moveCarouselTo(slideLeft) {
      
          slideRight = slideLeft + activeSlides - 1;
      
          //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
          var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;
      
          //next slide is always 1 slide after right-most slide, unless right-most slide is at end
          var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;
      
          //reset images to default classes
          for (let item of items) {
            item.className = itemClassName;
          }
      
          //set new previous, active and next images
          setClasses(newPrevious, slideLeft, newNext);
        }
      
        function initCarousel() {
          // Hide buttons if less than 3 items
          if (totalItems <= 3) {
            $('.carousel__button--next-4', blocks[index]).hide();
            $('.carousel__button--prev-4', blocks[index]).hide();
            // TODO: not sure why need to return, comment it out to let if it is less than 3 if will still show
            // return;
          } else {
            $('.carousel__button--prev-4', blocks[index]).hide();
            $('.carousel__button--next-4', blocks[index]).show();
      
            // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
            if (activeSlides == 1 && totalItems > 1 || activeSlides == 2 && totalItems > 2) {
              $('.carousel__button--next-4', blocks[index]).show();
            }
          }
          setClasses(totalItems - 1, 0, activeSlides);
          //setInitialClasses();
          // Set moving to false so that the carousel becomes interactive
          moving = false;
        }
      
      
        // TODO: make a better checker or function if possible
        function mediaSizeChecker() {
          var mobile = window.matchMedia("(max-width: 767px)");
          var tablet = window.matchMedia("(max-width: 1023px)");
      
          if (mobile.matches) { // If media query matches
            activeSlides = 1;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
          } else if (tablet.matches) {
            activeSlides = 2;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
          } else {
            activeSlides = 3;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
          }
        }

        window.addEventListener('resize', function () {
            mediaSizeChecker();
            initCarousel();
        });
      
        mediaSizeChecker();
        initCarousel();
        setEventListeners();
    }
}

if (document.querySelector('.block-you-may-also-like')) {
    carouselYmal4();
}
function carouselMini(d) {
    var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo";
    let items = d.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    console.log(totalItems + " total items");
    let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
    let slideLeft;
    let slideRight;

    // Set previous, active and next images (minimum of 3 images)
    function setClasses(previous, firstActive, next) {
        if (items[previous]) items[previous].className = itemClassName + " prev";
        if (items[firstActive]) items[firstActive].className = itemClassName + " active";
        for (let i = 1; i < activeSlides; i++) {
            if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
        }
        if (items[next]) items[next].className = itemClassName + " next";
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName('carousel__button--next')[0],
            prev = d.getElementsByClassName('carousel__button--prev')[0];
        next.addEventListener('click', moveNext);
        prev.addEventListener('click', movePrev);
    }

    // Next navigation handler
    function moveNext() {
        //if right-most slide has reached end of carousel, reset carousel to start
        if (slideRight === (totalItems - 1)) {
            slideLeft = 0;

            //else right-shift carousel based on number of slides remaining until end
        } else {
            // var slidesRemaining = totalItems - 1;
            // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
            slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--prev', d).show();

        if (totalItems - activeSlides === slideLeft) {
            $('.carousel__button--next', d).hide();
        } else {
            $('.carousel__button--next', d).show();
        }


        moveCarouselTo(slideLeft);
    }

    // Previous navigation handler
    function movePrev() {
        //if left-most slide has reached start of carousel, reset carousel to end
        if (slideLeft === 0) {
            slideLeft = (totalItems - activeSlides);

            //left-shift carousel based on number of slides remaining until start
        } else {
            slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--next', d).show();

        if (slideLeft === 0) {
            $('.carousel__button--prev', d).hide();
        } else {
            $('.carousel__button--prev', d).show();
        }

        moveCarouselTo(slideLeft);
    }

    function moveCarouselTo(slideLeft) {

        slideRight = slideLeft + activeSlides - 1;

        //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
        var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;

        //next slide is always 1 slide after right-most slide, unless right-most slide is at end
        var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

        //reset images to default classes
        for (let item of items) {
            item.className = itemClassName;
        }

        //set new previous, active and next images
        setClasses(newPrevious, slideLeft, newNext);
    }

    function initCarousel() {
        // Hide buttons if less than 3 items
        if (totalItems <= 3) {
            $('.carousel__button--next', d).hide();
            $('.carousel__button--prev', d).hide();
            // TODO: not sure why need to return, comment it out to let if it is less than 3 if will still show
            // return;
        }else{
            $('.carousel__button--prev', d).hide();
            $('.carousel__button--next', d).show();

            // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
            if(activeSlides === 1 && totalItems > 1 || activeSlides === 2 && totalItems > 2){
                $('.carousel__button--next', d).show();
            }
        }
        setClasses(totalItems - 1, 0, activeSlides);
        //setInitialClasses();
        setEventListeners();
        // Set moving to false so that the carousel becomes interactive
        moving = false;
    }


    // TODO: make a better checker or function if possible
    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        console.log(mobile);
        console.log(tablet);

        if (mobile.matches) { // If media query matches
            activeSlides = 1;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("mobile");
        } else if (tablet.matches) {
            activeSlides = 2;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("tablet");
        } else {
            activeSlides = 3;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("desktop");
        }
    }

    mediaSizeChecker();
    initCarousel();

}
/* Products Box Group (Security) */

function carouselSecurity(d) {
    var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo";
    let items = d.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    console.log(totalItems + " total items");
    let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
    let slideLeft;
    let slideRight;

    // Set previous, active and next images (minimum of 3 images)
    function setClasses(previous, firstActive, next) {
        if (items[previous]) items[previous].className = itemClassName + " prev";
        if (items[firstActive]) items[firstActive].className = itemClassName + " active";
        for (let i = 1; i < activeSlides; i++) {
            if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
        }
        if (items[next]) items[next].className = itemClassName + " next";
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName('carousel__button--next')[0],
            prev = d.getElementsByClassName('carousel__button--prev')[0];
        next.addEventListener('click', moveNext);
        prev.addEventListener('click', movePrev);
    }

    // Next navigation handler
    function moveNext() {
        //if right-most slide has reached end of carousel, reset carousel to start
        if (slideRight === (totalItems - 1)) {
            slideLeft = 0;

        //else right-shift carousel based on number of slides remaining until end
        } else {
            // var slidesRemaining = totalItems - 1;
            // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
            slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--prev').show();

        if (totalItems - activeSlides === slideLeft) {
            $('.carousel__button--next', d).hide();
        } else {
            $('.carousel__button--next', d).show();
        }


        moveCarouselTo(slideLeft);
    }

    // Previous navigation handler
    function movePrev() {
        //if left-most slide has reached start of carousel, reset carousel to end
        if (slideLeft === 0) {
            slideLeft = (totalItems - activeSlides);

        //left-shift carousel based on number of slides remaining until start
        } else {
            slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--next', d).show();

        if (slideLeft === 0) {
            $('.carousel__button--prev', d).hide();
        } else {
            $('.carousel__button--prev', d).show();
        }

        moveCarouselTo(slideLeft);
    }

    function moveCarouselTo(slideLeft) {

        slideRight = slideLeft + activeSlides - 1;

        //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
        var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;

        //next slide is always 1 slide after right-most slide, unless right-most slide is at end
        var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

        //reset images to default classes
        for (let item of items) {
            item.className = itemClassName;
        }

        //set new previous, active and next images
        setClasses(newPrevious, slideLeft, newNext);
    }

    function initCarousel() {
        // Hide buttons if less than 3 items
        if(totalItems <= 3) {
            $('.carousel__button--next', d).hide();
            $('.carousel__button--prev', d).hide();

            // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
            if(activeSlides === 1 && totalItems > 1 || activeSlides === 2 && totalItems > 2){
                $('.carousel__button--next', d).show();
            }

        }else{
            $('.carousel__button--prev', d).hide();
            $('.carousel__button--next', d).show();
        }
        setClasses(totalItems - 1, 0, activeSlides);
        //setInitialClasses();
        setEventListeners();
        // Set moving to false so that the carousel becomes interactive
        moving = false;
    }


    // TODO: make a better checker or function if possible
    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        console.log(mobile);
        console.log(tablet);

        if (mobile.matches) { // If media query matches
            activeSlides = 1;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("mobile");
        } else if (tablet.matches) {
            activeSlides = 2;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("tablet");
        } else {
            activeSlides = 3;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("desktop");
        }
    }

    mediaSizeChecker();
    initCarousel();

    var cardTitles = document.querySelectorAll('.block-custom-products-box-group-security .card.card-radius .card-body .card-text.mt-auto');
    var cardContents = document.querySelectorAll('.block-custom-products-box-group-security .card.card-radius .card-body .text-left.mt-auto');
    if (cardTitles) {
        for (const cardTitle of cardTitles) {
            cardTitle.classList.remove('mt-auto');
        }
    }
    if (cardContents) {
        for (const cardContent of cardContents) {
            cardContent.classList.remove('mt-auto');
        }
    }
}

/* Products Box Group (Security) */

/* Products Box Group (X Btn) */

function carouselXBtn(d) {
    var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo";
    let items = d.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    console.log(totalItems + " total items");
    let activeSlides; // Slides to show - 3 on desktop, 1 on tablet and mobile
    let slideLeft;
    let slideRight;

    // Set previous, active and next images (minimum of 3 images)
    function setClasses(previous, firstActive, next) {
        if (items[previous]) items[previous].className = itemClassName + " prev";
        if (items[firstActive]) items[firstActive].className = itemClassName + " active";
        for (let i = 1; i < activeSlides; i++) {
            if (items[slideLeft + i]) items[slideLeft + i].className = itemClassName + " active";
        }
        if (items[next]) items[next].className = itemClassName + " next";
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName('carousel__button--next')[0],
            prev = d.getElementsByClassName('carousel__button--prev')[0];
        next.addEventListener('click', moveNext);
        prev.addEventListener('click', movePrev);
    }

    // Next navigation handler
    function moveNext() {
        //if right-most slide has reached end of carousel, reset carousel to start
        if (slideRight === (totalItems - 1)) {
            slideLeft = 0;

            //else right-shift carousel based on number of slides remaining until end
        } else {
            // var slidesRemaining = totalItems - 1;
            // slideLeft = (slidesRemaining >= activeSlides) ? slideLeft + activeSlides-2 : slideLeft + slidesRemaining;
            slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--prev', d).show();

        if (totalItems - activeSlides === slideLeft) {
            $('.carousel__button--next', d).hide();
        } else {
            $('.carousel__button--next', d).show();
        }


        moveCarouselTo(slideLeft);
    }

    // Previous navigation handler
    function movePrev() {
        //if left-most slide has reached start of carousel, reset carousel to end
        if (slideLeft === 0) {
            slideLeft = (totalItems - activeSlides);

            //left-shift carousel based on number of slides remaining until start
        } else {
            slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
        }

        //console.log("SL= "+slideLeft);

        //show/hide button based on scrollable
        $('.carousel__button--next', d).show();

        if (slideLeft === 0) {
            $('.carousel__button--prev', d).hide();
        } else {
            $('.carousel__button--prev', d).show();
        }

        moveCarouselTo(slideLeft);
    }

    function moveCarouselTo(slideLeft) {

        slideRight = slideLeft + activeSlides - 1;

        //previous slide is always 1 slide before left-most slide, unless left-most slide is at start
        var newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;

        //next slide is always 1 slide after right-most slide, unless right-most slide is at end
        var newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

        //reset images to default classes
        for (let item of items) {
            item.className = itemClassName;
        }

        //set new previous, active and next images
        setClasses(newPrevious, slideLeft, newNext);
    }

    function initCarousel() {
        // Hide buttons if less than 3 items
        if (totalItems <= 3) {
            $('.carousel__button--next', d).hide();
            $('.carousel__button--prev', d).hide();
        
            // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
            if(activeSlides === 1 && totalItems > 1 || activeSlides === 2 && totalItems > 2){
                $('.carousel__button--next', d).show();
            }

        }else{
            $('.carousel__button--next', d).show();
            $('.carousel__button--prev', d).hide();
        }
        setClasses(totalItems - 1, 0, activeSlides);
        //setInitialClasses();
        setEventListeners();
        // Set moving to false so that the carousel becomes interactive
        moving = false;
    }


    // TODO: make a better checker or function if possible
    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        console.log(mobile);
        console.log(tablet);

        if (mobile.matches) { // If media query matches
            activeSlides = 1;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("mobile");
        } else if (tablet.matches) {
            activeSlides = 2;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("tablet");
        } else {
            activeSlides = 3;
            slideLeft = 0;
            slideRight = slideLeft + activeSlides - 1;
            console.log("desktop");
        }
    }

    mediaSizeChecker();
    initCarousel();

}

/* Products Box Group (X Btn) */
/* Products Box Group Btn */

function carousel(d) {
    var itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 margin-bottom carousel__photo";
    let items = d.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    //console.log(totalItems + " total items");

    let numberProductsToDisplay;
    let displayListStart;
    let displayListEnd;
    let previousdisplayListStart;
    let previousdisplayListEnd;
    let mobileProductsToShow;
    let tabletProductsToShow;
    let desktopProductsToShow;

    // 0 = no continues auto wrap back to beginning
    // 1 = auto wrap back
    var carouselMode = 1;

    // TODO: make a better checker or function if possible
    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        displayListStart = 1;
        mobileProductsToShow = 1;
        tabletProductsToShow = 2;
        desktopProductsToShow = 3;
        previousdisplayListStart = 0;
        previousdisplayListEnd = 0;

        if (mobile.matches) { // If media query matches
            numberProductsToDisplay = mobileProductsToShow;
            displayListEnd = numberProductsToDisplay;
        } else if (tablet.matches) {
            numberProductsToDisplay = tabletProductsToShow;
            displayListEnd = numberProductsToDisplay;
        } else {
            numberProductsToDisplay = desktopProductsToShow;
            displayListEnd = numberProductsToDisplay;
        }
    }

    function initCarousel() {
        if (totalItems <= numberProductsToDisplay) {
            $('.carousel__button--next', d).hide();
            $('.carousel__button--prev', d).hide();

            console.log(displayListEnd);

            // Show btn if active slide is 1 (on moble) and more than 1 item, same with tablet
            if (displayListEnd === 1 && totalItems > 1 || displayListEnd === 2 && totalItems > 2) {
                $('.carousel__button--next', d).show();
            }

        } else {
            if (carouselMode == 0) {
                $('.carousel__button--prev', d).hide();
                $('.carousel__button--next', d).show();
            } else if (carouselMode == 1) {

                $('.carousel__button--prev', d).hide();
                $('.carousel__button--next', d).show();
            }
        }

        resetAllProductList();
        displayProductList();
    }

    function displayProductList() {
        for (let i = displayListStart; i <= displayListEnd; i++) {
            if (items[i - 1]) {
                items[i - 1].style.display = "block";
                items[i - 1].classList.add("active");
            }
        }
    }

    function undisplayCurrentProductlist() {
        for (let j = previousdisplayListStart; j <= previousdisplayListEnd; j++) {
            if (items[j - 1]) {
                items[j - 1].style.display = "none";
                items[j - 1].classList.remove("active");
            }
        }
    }

    function resetAllProductList() {
        for (let x = 0; x < items.length; x++) {
            items[x].style.display = "none";
            items[x].classList.remove("active");
        }
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName('carousel__button--next')[0],
            prev = d.getElementsByClassName('carousel__button--prev')[0];
        next.addEventListener('click', moveNext);
        prev.addEventListener('click', movePrev);
    }

    // Next navigation handler
    function moveNext() {
        //Set previous set of listing
        previousdisplayListStart = displayListStart;
        previousdisplayListEnd = displayListEnd;

        //No wrap back mode
        if (carouselMode == 0) {
            displayListStart += 1;
            displayListEnd += 1;

            // If it is the last of the list, hide the next btn
            if (displayListEnd >= totalItems) {
                $('.carousel-button-next', d).hide();
            }

            // If first product list is not the first one, show prev btn
            if (displayListStart != 1) {
                $('.carousel-button-prev', d).show();
            }
        } else if (carouselMode == 1) { // Wrap back mode
            // If it is the last of the list, reset back to show infront
            if (displayListEnd >= totalItems) {
                displayListStart = 1;
                displayListEnd = numberProductsToDisplay;
            } else {
                displayListStart += 1;
                displayListEnd += 1;
            }
        }

        $('.carousel__button--prev', d).show();

        if (displayListStart === 1) {
            $('.carousel__button--prev', d).hide();
        }
        if (displayListEnd === totalItems) {
            $('.carousel__button--next', d).hide();
        }

        undisplayCurrentProductlist();
        displayProductList();
    }

    // Previous navigation handler
    function movePrev() {
        previousdisplayListStart = displayListStart;
        previousdisplayListEnd = displayListEnd;

        //No wrap back mode
        if (carouselMode == 0) {
            displayListStart -= 1;
            displayListEnd -= 1;

            // If it is the last of the list, hide the next btn
            if (displayListStart <= 1) {
                $('.carousel-button-prev', d).hide();
            }

            $('.carousel-button-next', d).show();

        } else if (carouselMode == 1) { // Wrap back mode
            // If it is the last of the list, reset back to show infront
            if (displayListStart <= 1) {
                displayListEnd = totalItems;
                displayListStart = displayListEnd - (numberProductsToDisplay - 1);
            } else {
                displayListStart -= 1;
                displayListEnd -= 1;
            }
        }

        $('.carousel__button--next', d).show();

        if (displayListStart === 1) {
            $('.carousel__button--prev', d).hide();
        }
        if (displayListEnd === totalItems) {
            $('.carousel__button--next', d).hide();
        }

        undisplayCurrentProductlist();
        displayProductList();
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
        initCarousel();
    });

    mediaSizeChecker();
    initCarousel();
    setEventListeners();

    var cardTitles = document.querySelectorAll('.block-custom-products-box-group-btn .card.card-radius .card-body .card-text.mt-auto');
    var cardContents = document.querySelectorAll('.block-custom-products-box-group-btn .card.card-radius .card-body .text-left.mt-auto');
    if (cardTitles) {
        for (const cardTitle of cardTitles) {
            cardTitle.classList.remove('mt-auto');
        }
    }
    if (cardContents) {
        for (const cardContent of cardContents) {
            cardContent.classList.remove('mt-auto');
        }
    }
}

/* Products Box Group Btn */

// Method to call if can get parent block unique id
// function setAccordion(parentClassName) {
//     let selectField = parentClassName.getElementsByClassName('accordion-select-field')[0];

//     if (selectField) {
//         selectField.onclick = function () {
//             //Change +,- symbol
//             selectField.children[1].classList.toggle("active");
//             //Open, close panel
//             var panel = selectField.nextElementSibling;
//             if (panel.style.maxHeight) {
//                 panel.style.maxHeight = null;
//             } else {
//                 panel.style.maxHeight = panel.scrollHeight + "px";
//             }
//         }
//     }
// }

// Temporary method where if cannot get parent block unique id
function setAccordion() {
    const acc = document.querySelectorAll('.accordion-select-field');
    let i;
    
    if (acc) {
        for (i = 0; i < acc.length; i++) {
            if (acc[i].onclick == null) {
                acc[i].onclick = function () {
                    //to change + symbol to -
                    this.children[1].classList.toggle("active");
                    
                    //open this accordion panel
                    var panel = this.nextElementSibling;
                    if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                    } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }
        }
    }
}

if (document.querySelector('.block-accordion')) {
    setAccordion();
}

/* Affin Group Slider */
// showSlide(slideIndex);

// function currentSlides(n) {
//     showSlide(slideIndex = n);
// }

// function showSlide(n) {
//     var i;
//     var slides = document.getElementsByClassName("slide");
//     var dots = document.getElementsByClassName("my-dot");
//     if (n > slides.length) {
//         slideIndex = 1
//     }
//     if (n < 1) {
//         slideIndex = slides.length
//     }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         // dots[i].className = dots[i].className.replace(" active", "");
//         dots[i].classList.remove('active');
//     }
//     if (slides[slideIndex - 1] !== undefined) {
//         slides[slideIndex - 1].style.display = "block";
//     }
//     if (dots[slideIndex - 1] !== undefined) {
//         // dots[slideIndex - 1].className += " active";
//         dots[slideIndex - 1].classList.add('active');
//     }
// }

/* Affin Group Slider */

function tncAccordion(id, parentClassName) {
    const firstCategory = document.querySelector('.' + parentClassName + ' #' + id);
    if (firstCategory) {
        firstCategory.classList.add('active');
    }

    const coll = document.querySelectorAll('.' + parentClassName + ' .tnc-collapsible');
    let i, j;

    if (coll) {
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                for (let i = 0; i < this.childNodes.length; i++) {
                    const temp = this.childNodes[i];

                    if (temp instanceof Element) {
                        if (temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                }
            });
        }
    }

    const header_btn = document.querySelectorAll('.' + parentClassName + ' .header-btn');
    const accordion_group = document.querySelectorAll('.' + parentClassName + ' .tnc-accordion-group');

    for (let j = 0; j < accordion_group.length; j++) {
        accordion_group[j].style.display = 'none';
    }

    for (i = 0; i < header_btn.length; i++) {
        if (i < 1) {
            accordion_group[i].style.display = "block";
        } else {
            accordion_group[i].style.display = "none";
        }
    }
}

tncAccordion();

$(document).on('click', 'a', function (e) {
    e.preventDefault();
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            const isExternalLink = this.href.indexOf('192') < 0 &&
                this.href.indexOf('localhost') < 0 &&
                this.href.indexOf('aa-dev.cakexp.com') < 0 &&
                this.href.indexOf('a1-dev.cakexp.com') < 0 &&
                this.href.indexOf('ag-dev.cakexp.com') < 0 &&
                this.href.indexOf('affinalways.com') < 0 &&
                this.href.indexOf('affingroup.com') < 0 &&
                this.href.indexOf('a1addin.com') < 0 &&
                this.href.indexOf('affinalways-dev.cakexp.com') < 0 &&
                this.href.indexOf('affingroup-dev.cakexp.com') < 0 &&
                this.href.indexOf('a1addin-dev.cakexp.com') < 0 &&
                this.href.indexOf('affinonline.com') < 0 &&
                this.href.indexOf('javascript:void(0);') < 0 &&
                this.href.indexOf('affinbank.com.my') < 0 &&
                this.href.indexOf('affinislamic.com.my') < 0 &&
                this.href.indexOf('affin.com.my') < 0 &&
                this.href.indexOf('affinhwang.com') < 0 &&
                this.href.indexOf('172') < 0 &&
                this.href.indexOf('affinmax.com') < 0 &&
                this.href.indexOf('google.com.my') < 0 &&
                this.href.indexOf('test.salesforce.com') < 0 &&
                this.href.indexOf('affininvikta.com') < 0 &&
                this.href.indexOf('mysanafnb155:7005') < 0;

            const isYoutubeLink = this.href.indexOf('youtube.com') > 0;

            if (this.getAttribute('onclick')) {
                e.preventDefault();
                eval(this.getAttribute('onclick'));
            } else {
                if (this.href.indexOf('#') >= 0 || this.href.indexOf("")) {
                    // window.location.href = this.href;
                } else if (isExternalLink) {
                    e.preventDefault();
                    if (window.location.href !== 'about:blank') {
                        security_not(this.href, lang);
                    }
                } else if (!isExternalLink) {
                    e.preventDefault();
                    if (window.location.href !== 'about:blank') {
                        // window.location.href = this.href;
                        const path = window.location.pathname;
                        if (path.indexOf('preview') >= 0) {
                            const href = this.getAttribute('href');
                            const pageName = (href.split('/')).pop();
                            if (pageName.indexOf('pageId') < 0 && (href.indexOf('https://') < 0 && href.indexOf('http://') < 0)) {
                                fetch('/getPageId/pageId?page_name=' + pageName)
                                    .then(response => response.text())
                                    .then(pageId => {
                                        if (href.indexOf('preview') < 0) {
                                            const previewHref = '/preview/' + href + '?pageId=' + pageId;
                                            this.setAttribute('href', previewHref);
                                        }
                                        window.open(this.getAttribute('href'), '_self');
                                    });
                            } else {
                                window.open(this.getAttribute('href'), '_self');
                            }
                        } else {
                            window.open(this.getAttribute('href'), '_self');
                        }
                    }
                }
            }
        });
});

function security_not(url, lang) {
    let cancelBtn = 'Cancel';
    let proceedButton = 'Proceed';
    if (lang === 'ms') {
        cancelBtn = 'Batal';
        proceedButton = 'Teruskan';
    }
    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: [
            {
                class: 'cancelButtonClass',
                text: cancelBtn,
                click: function () {
                    $(this).dialog('destroy');
                }
            },
            {
                class: 'proceedButtonClass',
                text: proceedButton,
                click: function () {
                    window.open(url, '_blank');
                    $(this).dialog('destroy');
                }
            }
        ]
    });
}

function groupOfCompanyCarouselScroll() {
    const parent = document.getElementsByClassName("block-group-of-companies-carousel")[0];

    if (parent) {
        const target = parent.getElementsByClassName("overflow-content")[0];

        if (target) {

            document.addEventListener("wheel", function (e) {
                // prevent the default scrolling event
                // e.preventDefault();

                if (event.deltaY < 0) // scrolling up
                {
                    target.scrollBy(e.deltaX, e.deltaY);
                } else if (event.deltaY > 0) // scrolling down
                {
                    if ($(target).scrollTop() + $(target).innerHeight() >= $(target)[0].scrollHeight) {
                        // alert('end reached');
                    } else {
                        target.scrollBy(e.deltaX, e.deltaY);
                        document.body.scrollBy(-e.deltaX, -e.deltaY);
                    }
                }
            }, {passive: true})
        }
    }
}

if (document.querySelector('.block-group-of-companies-carousel')) {
    groupOfCompanyCarouselScroll();
}

function videoCTAYoutube() {
    let blocks = document.getElementsByClassName('block-video-cta-youtube'); //Get all the video cta utube block

    for (let i = 0; i < blocks.length; i++) {
        let playLinkBtn = blocks[i].getElementsByClassName('play-link')[0]; // Get the play button of that block
        let watchVideoBtn = playLinkBtn.search; // Get youtube video ID from href
        const urlParams = new URLSearchParams(watchVideoBtn);
        const youtubeVideoId = urlParams.get('v');

        let tempId = "video-cta-youtube-modal" + i; // Set the modal toggle id
        let tempTargetId = "#" + tempId;
        playLinkBtn.dataset.target =  tempTargetId

        let videoModal = blocks[i].getElementsByClassName('modal')[0]; // Get the modal and set the id
        videoModal.id = tempId;

        let videoSrc = "https://www.youtube.com/embed/" + youtubeVideoId;

        // let backgroundYoutubeVideo = blocks[i].getElementsByClassName('bg-video-foreground')[0]; // Set block background iframe
        // let bgYoutubeIframe = '<iframe src="' + videoSrc + '?autoplay=1&mute=1&playlist=' + youtubeVideoId + '&loop=1&controls=0" frameborder="0"></iframe>';
        // backgroundYoutubeVideo.innerHTML = bgYoutubeIframe;

        let popupYoutubeVideo = blocks[i].getElementsByClassName('popup-content')[0]; // Set popup modal iframe
        let popupYoutubeIframe = '<iframe id="popup-iframe" src="" frameborder="0" allowfullscreen></iframe>';
        popupYoutubeVideo.innerHTML =  popupYoutubeIframe;

        $(tempTargetId).on('show.bs.modal', function () { // Set back the iframe src when open modal
            $('iframe', tempTargetId).attr("src", videoSrc);
        })

        $(tempTargetId).on('hidden.bs.modal', function () { // Set modal iframe src null when close the modal
            $('iframe', tempTargetId).attr("src", null);
        })
    }
}

videoCTAYoutube()

function switchAffinGroup2Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .tab-title`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .tab-title.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab2FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-2-tabs .tab");

    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-2-tabs')) {
    switchTab2FirstTab();
}
function switchAffinGroup3Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .tab-title`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .tab-title.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab3FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-3-tabs .tab");

    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-3-tabs')) {
    switchTab3FirstTab();
}
function switchAffinGroup4Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .col.tab-col`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .col.tab-col.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab4FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-4-tabs .tab");
    
    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-4-tabs')) {
    switchTab4FirstTab();
}
function switchAffinGroup5Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .col.tab-col`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .col.tab-col.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab5FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-5-tabs .tab");

    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-5-tabs')) {
    switchTab5FirstTab();
}
function switchAffinGroup6Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .col.tab-col`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .col.tab-col.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab6FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-6-tabs .tab");
    
    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-6-tabs')) {
    switchTab6FirstTab();
}
function customerCareTabbedComponent(event)
{
    if (!event) return;
    
    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');
    // console.log(parentClassName);

    const tabs = document.querySelectorAll(`.${parentClassName} .cc-tab`);
    const tabsContent = document.querySelectorAll(`.${parentClassName} .tab-content`);
    const clicked = event.children[0];
    // console.log(clicked);

    tabs.forEach(t => t.classList.remove('tab--active'));
    tabsContent.forEach(c => c.classList.remove('content--active'));
    clicked.classList.add('tab--active');

    document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).classList.add('content--active');

    //radio btn (Not used anymore, using their form from iframe)
    // const radioBtn = document.querySelectorAll(`.${parentClassName} .feedback-btn`);
    // const radioBtnContainer = document.querySelector(`.${parentClassName} .feedback-btn-container`);

    // if (radioBtnContainer) {
    //     radioBtnContainer.addEventListener('click', function (e) {
    //         const clicked = e.target.closest('.feedback-btn');

    //         if (!clicked) {
    //             return;
    //         }

    //         radioBtn.forEach(t => t.classList.remove('feedback-btn-selected'));
    //         clicked.classList.add('feedback-btn-selected');
    //     });
    // }
    
    //getURLParam(tabs, tabsContent);
}

function getURLParam(tabs, tabsContent) {
    fetch('/currentLang')
    .then(response => response.text())
    .then(lang => {
        var url = new URL(location.href);
        var section = url.searchParams.get('section');
        var sectionSelected;
        var sectionParent;
        var tempContactCenter;
        var tempBranchOperation;
        var tempOnlineFeed;
        var tempYourVoice;

        switch (lang) {
            case 'zh':
               
                break;
            case 'ms':
                tempContactCenter = "Pusat Panggilan";
                tempBranchOperation = "Waktu Operasi Cawagan"
                tempOnlineFeed = "Borang Maklum Balas";
                tempYourVoice = "Suarakan Pendapat Anda!"
                break;
            case 'en':
                default:
                    tempContactCenter = "Contact Center";
                    tempBranchOperation = "Branch Operation Hours"
                    tempOnlineFeed = "Online Feedback Form";
                    tempYourVoice = "Your Voice Counts!"
                break;
        }

        if (section) {
            if (section == "contactcenter") {
                // sectionSelected = $("p:contains(Pusat Panggilan)");
                sectionSelected = $("p:contains(" + tempContactCenter + ")");
            }
            else if (section == "branchoperation") {
                // sectionSelected = $("p:contains(Branch Operation Hours)");
                sectionSelected = $("p:contains(" + tempBranchOperation + ")");
            }
            else if (section == "onlinefeedback") {
                // sectionSelected = $("p:contains(Online Feedback Form)");
                sectionSelected = $("p:contains(" + tempOnlineFeed + ")");
            }
            else if (section == "yourvoice") {
                // sectionSelected = $("p:contains(Your Voice Counts!)");
                sectionSelected = $("p:contains(" + tempYourVoice + ")");
            }

            tabs.forEach(t => t.classList.remove('tab--active'));
            tabsContent.forEach(c => c.classList.remove('content--active'));
            sectionSelected.closest('.cc-tab')[0].classList.add('tab--active');

            document.querySelector(`.tab-content--${sectionSelected.closest('.cc-tab')[0].dataset.tab}`).classList.add('content--active');

            sectionParent = sectionSelected[1];

            // console.log(sectionParent);

            sectionParent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

if (document.querySelector('.block-customer-care')) {
    customerCareTabbedComponent();
}
function landingTC1YoutubeAPI() {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    //function onYouTubeIframeAPIReady() { // this is the ori function but if write like thos wont call so I used window
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: 'M7lc1UVf-VE', //<-- default video that will play
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady,
                // 'onStateChange': onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        const playBtn = $('.play-btn')[0];
        const close_btn = $('.close')[0];
        const video_wrapper = $('.video-wrapper')[0];

        playBtn.addEventListener("click", () => {
            landingTC1YoutubeIDSearch(player);
            player.playVideo();
            video_wrapper.classList.toggle("display-none");
        });

        video_wrapper.addEventListener("click", () => {
            player.stopVideo();
            video_wrapper.classList.toggle("display-none");
        });
    }
}

function landingTC1YoutubeIDSearch(player) {
    let video_button = $('.video-button-a')[0];
    video_button = video_button.search;
    const urlParams = new URLSearchParams(video_button);
    const youtubeVideoId = urlParams.get('v');

    if (youtubeVideoId) { // if link is null then will load the previos loaded video
        player.loadVideoById(youtubeVideoId);
    }
}

landingTC1YoutubeAPI();
function affinAlwaysSwitchToTab(tabName) {
    const tabs = document.querySelectorAll('.block-affin-always-tabs .tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    const tab = document.getElementById(tabName);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll('.tab-links');
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

affinAlwaysSwitchToTab('services');

function discover_affingroup_announcement_carosel(d) {
    let itemClassName = "col-lg-4 col-md-6 col-sm-12 col-xs-12 padding-left-right";
    let items = d.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    let numberProductsToDisplay;
    let displayListStart;
    let displayListEnd;
    let previousdisplayListStart;
    let previousdisplayListEnd;
    let mobileProductsToShow;
    let tabletProductsToShow;
    let desktopProductsToShow;

    // 0 = no continues auto wrap back to beginning
    // 1 = auto wrap back
    var carouselMode = 0;

    // TODO: make a better checker or function if possible
    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        displayListStart = 1;
        mobileProductsToShow = 1;
        tabletProductsToShow = 2;
        desktopProductsToShow = 3;
        previousdisplayListStart = 0;
        previousdisplayListEnd = 0;

        if (mobile.matches) { // MOBILE
            numberProductsToDisplay = mobileProductsToShow;
            displayListEnd = numberProductsToDisplay;
            console.log("mediacChecked");
        } else if (tablet.matches) { // TABLET
            numberProductsToDisplay = tabletProductsToShow;
            displayListEnd = numberProductsToDisplay;
            console.log("mediacChecked");
        } else { // DESKTOP
            numberProductsToDisplay = desktopProductsToShow;
            displayListEnd = numberProductsToDisplay;
            console.log("mediacChecked");
        }
    }

    function initCarousel() {
        // Hide the buttons if displaylist is <= to total available items
        if(totalItems <= numberProductsToDisplay) {
            $('.carousel-button-next', d).hide();
            $('.carousel-button-prev', d).hide();
        }else{

            if(carouselMode == 0){
                $('.carousel-button-prev', d).hide();
                $('.carousel-button-next', d).show();
            }else if(carouselMode == 1){
                $('.carousel-button-prev', d).show();
                $('.carousel-button-next', d).show();
            }
        }

        resetAllProductList();
        displayProductList();
    }

    function displayProductList(){
        for (let i = displayListStart; i <= displayListEnd; i++){
            if (items[i - 1]) items[i - 1].style.display = "block";
        }
    }

    function undisplayCurrentProductlist(){
        for (let j = previousdisplayListStart; j <= previousdisplayListEnd; j++){
            if (items[j - 1]) items[j - 1].style.display = "none";
        }
    }

    function resetAllProductList(){
        for (let x = 0; x < items.length; x++){
            items[x].style.display = "none";
        }
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName('carousel-button-next')[0],
            prev = d.getElementsByClassName('carousel-button-prev')[0];

        next.addEventListener('click', moveNext);
        prev.addEventListener('click', movePrev);
    }

    function moveNext() {
        //Set previous set of listing
        previousdisplayListStart = displayListStart;
        previousdisplayListEnd = displayListEnd;

        //No wrap back mode
        if (carouselMode == 0){
            displayListStart += 1;
            displayListEnd += 1;

            // If it is the last of the list, hide the next btn
            if(displayListEnd >= totalItems){
                $('.carousel-button-next', d).hide();
            }

            // If first product list is not the first one, show prev btn
            if(displayListStart != 1){
                $('.carousel-button-prev', d).show();
            }
        }else if (carouselMode == 1){ // Wrap back mode
            // If it is the last of the list, reset back to show infront
            if(displayListEnd >= totalItems){
                displayListStart = 1;
                displayListEnd = numberProductsToDisplay;
            }else{
                displayListStart += 1;
                displayListEnd += 1;
            }
        }

        undisplayCurrentProductlist();
        displayProductList();
    }

    // Previous navigation handler
    function movePrev() {
        previousdisplayListStart = displayListStart;
        previousdisplayListEnd = displayListEnd;

        //No wrap back mode
        if (carouselMode == 0){
            displayListStart -= 1;
            displayListEnd -= 1;

            // If it is the last of the list, hide the next btn
            if(displayListStart <= 1){
                $('.carousel-button-prev', d).hide();
            }

            $('.carousel-button-next', d).show();

        }else if (carouselMode == 1){ // Wrap back mode
            // If it is the last of the list, reset back to show infront
            if(displayListStart <= 1){
                displayListEnd = totalItems;
                displayListStart = displayListEnd - (numberProductsToDisplay - 1);
            }else{
                displayListStart -= 1;
                displayListEnd -= 1;
            }
        }

        undisplayCurrentProductlist();
        displayProductList();
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
        initCarousel();
    });

    mediaSizeChecker();
    initCarousel();
    setEventListeners();
}

function ready(f) {
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
}

function setupFeeAndCharges() {
    const block_fnc = document.querySelectorAll('.block-fees-n-charges');
    for (let i = 0; i < block_fnc.length; i++) {
        block_fnc[i].id = "fnc-id-" + i;

        fncAccordion(block_fnc[i].id);
    }
}

function fncAccordion(parentClassName) {
    const fnc_col = document.querySelectorAll(`#${parentClassName} .fnc-collapsible`);
    let i;

    if (fnc_col) {
        for (i = 0; i < fnc_col.length; i++) {
            fnc_col[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                const parentContent = this.parentElement;

                if (parentContent.classList.contains("content") && parentContent.style.maxHeight) {
                    parentContent.style.maxHeight = parentContent.scrollHeight + content.scrollHeight + 'px';
                }

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }
                else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                for (let i = 0; i < this.childNodes.length; i++) {
                    const temp = this.childNodes[i];

                    if (temp instanceof Element) {
                        if (temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                    else {
                        if (temp.classList && temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                }
            });
        }
    }
}

function fcnTabChange(event) {
    if (!event) return;

    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');
    // console.log(parentClassName);


    // const fnc_header_btn = document.querySelectorAll(`.${parentClassName} .fnc-sub-header-btn`);
    // const accordion_group = document.querySelectorAll(`.${parentClassName} .fnc-accordion-group`);

    const fnc_header_btn = document.querySelectorAll(`.block-fees-n-charges .fnc-sub-header-btn`);
    const accordion_group = document.querySelectorAll(`.block-fees-n-charges .fnc-accordion-group`);

    const clicked = event;

    fnc_header_btn.forEach(f => f.classList.remove('fnc-active'));
    accordion_group.forEach(f => f.style.display = 'none');
    clicked.classList.add('fnc-active');

    // document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).style.display = 'block';
    document.querySelector(`.block-fees-n-charges .tab-content--${clicked.dataset.tab}`).style.display = 'block';
}

ready(function() { // TODO: this is just a workaround, it should be fixed with properly logic in future
    let index = 0;
    const maxIndex = 60;

    const timer = setInterval(function() {
        if (document.querySelector('.block-fees-n-charges')) {
            setupFeeAndCharges();

            const islamicContent = document.querySelector('.block-fees-n-charges .fnc-accordion-group.affin-always-fnc-tab-2.tab-content--2');
            if (islamicContent) {
                islamicContent.style.display = 'none';
            }
        }

        if (index >= maxIndex) {
            clearInterval(timer);
        } else {
            index++;
        }

    }, 1000)
})
function ready(f) {
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
}

function setRatesAndPricing() {
    const block_rnp = document.querySelectorAll('.block-rates-and-pricing');
    for (let i = 0; i < block_rnp.length; i++) {
        block_rnp[i].id = "rnp-id-" + i;

        getJsonDataRnP(block_rnp[i].id);
    }
}

function getJsonDataRnP(parentClassName) {
    fetch('/storage/rates/forex-1-unit.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const forex_1_content = document.querySelector(`#${parentClassName} .forex-1`);

                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {
                        let currency;
                        let code;
                        let selling;
                        let buying_tt;
                        let buying_od;
                        let imgArray = ['U.S.DOLLAR.svg', 'EURO.svg', 'BRITISH POUND.svg', 'SINGAPORE DOLLAR.svg', 'BRUNEI DOLLAR.svg', 'AUSTRALIAN DOLLAR.svg', 'CANADIAN DOLLAR.svg', 'NEW ZEALAND DOLLAR.svg', 'SWISS FRANC.svg'];

                        switch (lang) {
                            case 'ms':
                            const forex_1_text = document.querySelectorAll(`#${parentClassName} .sub-text-paragraph`)[0];
                            forex_1_text.innerHTML = "RM tempatan kepada satu unit Matawang Asing";
                            const forex_100_text = document.querySelectorAll(`#${parentClassName} .sub-text-paragraph`)[1];
                            forex_100_text.innerHTML = "RM tempatan kepada 100 unit Matawang Asing";
                                break;
                            case 'en':
                            default:
                                break;
                        }

                        for (let i = -1; i < data.length; i++) {

                            const ratesElement = document.createElement('DIV');

                            if(i < 0) {
                                switch (lang) {
                                    case 'ms':
                                        ratesElement.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Jualan TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian OD</div>';
                                            ratesElement.className = 'rates-details';
                                        break;
                                    case 'en':
                                    default:
                                        ratesElement.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Selling TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying OD</div>';
                                            ratesElement.className = 'rates-details';
                                        break;
                                }
                            } else {

                                currency = data[i].currency;
                                code = data[i].code;
                                selling = data[i].selling.ttod;
                                buying_tt = data[i].buying.tt;
                                buying_od = data[i].buying.od;

                                if (selling == "#VALUE!") { selling = "N/A"; }
                                if (buying_tt == "#VALUE!") { buying_tt = "N/A"; }
                                if (buying_od == "#VALUE!") { buying_od = "N/A"; }

                                ratesElement.innerHTML =
                                    '<img src="/img/' + imgArray[i] + '" class="flag-img" alt=""/>' +
                                    '<div class="sub-text-currency-code mt-2">'+ currency + '</div>' +
                                    '<div class="sub-text-currency-code">'+ code + '</div>' +
                                    '<div class="sub-text-buy-sell">'+ selling + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_tt + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_od + '</div>';
                                    ratesElement.className = 'rates-details';
                                }

                                if (forex_1_content) {
                                    forex_1_content.append(ratesElement);
                                }
                            }
                    });
            }

        fetch('/storage/rates/forex-100-unit.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const forex_100_content = document.querySelector(`#${parentClassName} .forex-100`);

                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {

                        let currency;
                        let code;
                        let selling;
                        let buying_tt;
                        let buying_od;
                        let imgArray = ['DANISH KRONE.svg', 'HONG KONG DOLLAR.svg', 'INDIAN RUPEE.svg', 'INDONESIAN RUPIAH.svg', 'JAPANESE YEN.svg', 'NORWEGIAN KRONE.svg', 'PAKISTAN RUPEE.svg', 'PHILIPPINE PESO.svg', 'SAUDI RIYAL.svg', 'SOUTH AFRICAN RAND.svg', 'SWEDISH KRONA.svg', 'THAI BAHT.svg', 'FIJI DOLLAR.svg', 'PAPUA NEW GUINEA KINA.svg', 'OMAN RIAL.svg', 'BANGLADESH TAKA.svg', 'SRI LANKA RUPEE.svg', 'KUWAIT DINAR.svg', 'CHINESE RENMINBI.svg', 'UAE DIRHAM.svg'];

                        for (let i = -1; i < data.length; i++) {

                            const ratesElement100 = document.createElement('DIV');

                            if(i < 0) {
                                switch (lang) {
                                    case 'ms':
                                        ratesElement100.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Jualan TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian OD</div>';
                                            ratesElement100.className = 'rates-details';
                                        break;
                                    case 'en':
                                    default:
                                        ratesElement100.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Selling TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying OD</div>';
                                            ratesElement100.className = 'rates-details';
                                        break;
                                }
                            } else {

                                currency = data[i].currency;
                                code = data[i].code;
                                selling = data[i].selling.ttod;
                                buying_tt = data[i].buying.tt;
                                buying_od = data[i].buying.od;

                                if (selling == "#VALUE!") { selling = "N/A"; }
                                if (buying_tt == "#VALUE!") { buying_tt = "N/A"; }
                                if (buying_od == "#VALUE!") { buying_od = "N/A"; }

                                ratesElement100.innerHTML =
                                    '<img src="/img/' + imgArray[i] + '" class="flag-img" alt=""/>' +
                                    '<div class="sub-text-currency-code mt-2">'+ currency + '</div>' +
                                    '<div class="sub-text-currency-code">'+ code + '</div>' +
                                    '<div class="sub-text-buy-sell">'+ selling + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_tt + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_od + '</div>';
                                    ratesElement100.className = 'rates-details';
                            }

                            if (forex_100_content) {
                                forex_100_content.append(ratesElement100);
                            }
                        }
                        setAccordionRnP(parentClassName);
                    });
            }
        });

        fetch('/storage/rates/forex-date.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {
                        const forex_date = document.querySelectorAll(`#${parentClassName} .sub-text-warning.mt-2`)[0];
                        const rates_quoted_text = document.querySelectorAll(`#${parentClassName} .sub-text-warning.mt-2`)[1];

                        let date = data[0].date;

                        switch (lang) {
                            case 'ms':
                                date = date.replace('EXCHANGE RATE AS AT','KADAR PERTUKARAN SETAKAT').replace('TIME', 'MASA').replace('AM','PAGI').replace('PM','PETANG');
                                rates_quoted_text.innerHTML = "Kadar yang disebutkan adalah berdasarkan Kadar Kaunter Pertukaran Wang Asing harian AFFIN BANK dan boleh berubah tanpa notis terlebih dahulu.";
                                break;
                            case 'en':
                            default:
                                break;
                        }

                        if (forex_date) {
                            forex_date.innerHTML = '(' + date + ')';
                        }
                    });
            }
        });
    });
}

function changeTabsRnP(event) {
    if (!event) return;

    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.block-rates-and-pricing .r-n-p-tab`);
    const tabsContent = document.querySelectorAll(`.block-rates-and-pricing .tab-content`);

    const clicked = event;

    tabs.forEach(t => t.classList.remove('tab--active'));
    tabsContent.forEach(c => c.classList.remove('content--active'));
    clicked.classList.add('tab--active');

    document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).classList.add('content--active');
}

function setAccordionRnP(parentClassName) {
    const acc = document.querySelectorAll(`#${parentClassName} .r-n-p-collapsible`);
    let i;

    if (acc) {
        for (i = 0; i < acc.length; i++) {
            // if (acc[i].classList.contains("rnp-loaded")) return;
            // acc[i].classList.add("rnp-loaded");
            acc[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                const parentContent = this.parentElement;

                if (parentContent.classList.contains("content") && parentContent.style.maxHeight) {
                    parentContent.style.maxHeight = parentContent.scrollHeight + content.scrollHeight + 'px';
                }

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                for (let i = 0; i < this.childNodes.length; i++) {
                    const temp = this.childNodes[i];

                    if (temp instanceof Element) {
                        if (temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    } else {
                        if (temp.classList && temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                }
            });
        }
    }

    setOverflowBtnRnP(parentClassName);
}

function setOverflowBtnRnP(parentClassName){
    const forex_1_next_btn = document.querySelector(`#${parentClassName} .forex-1__button--next`);
    const forex_1_prev_btn = document.querySelector(`#${parentClassName} .forex-1__button--prev`);
    const forex_100_next_btn = document.querySelector(`#${parentClassName} .forex-100__button--next`);
    const forex_100_prev_btn = document.querySelector(`#${parentClassName} .forex-100__button--prev`);

    if ($(`#${parentClassName} .forex-1`)[0] && ($(`#${parentClassName} .forex-1`)[0].scrollWidth >  $(`#${parentClassName} .forex-1`).innerWidth())) {
        // alert("1 show");
        $(forex_1_next_btn).show();
        $(forex_1_prev_btn).show();
    } else {
        // alert("1 hide");
        $(forex_1_next_btn).hide();
        $(forex_1_prev_btn).hide();
    }

    if ($(`#${parentClassName} .forex-100`)[0] && ($(`#${parentClassName} .forex-100`)[0].scrollWidth >  $(`#${parentClassName} .forex-100`).innerWidth())) {
        // alert("100 show");
        $(forex_100_next_btn).show();
        $(forex_100_prev_btn).show();
    } else {
        // alert("100 hide");
        $(forex_100_next_btn).hide();
        $(forex_100_prev_btn).hide();
    }

    if (forex_1_next_btn) {
        forex_1_next_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-1`).animate({scrollLeft: '+=200'}, 200);
        });
    }

    if (forex_1_prev_btn) {
        forex_1_prev_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-1`).animate({scrollLeft: '-=200'}, 200);
        });
    }

    if (forex_100_next_btn) {
        forex_100_next_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-100`).animate({scrollLeft: '+=200'}, 200);
        });
    }

    if (forex_100_prev_btn) {
        forex_100_prev_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-100`).animate({scrollLeft: '-=200'}, 200);
        });
    }
}


ready(function() { // TODO: this is just a workaround, it should be fixed with properly logic in future
    let index = 0;
    const maxIndex = 60;

    const timer = setInterval(function() {
        if (document.querySelector('.block-rates-and-pricing')) {
            setRatesAndPricing();
	    clearInterval(timer);
        }

        if (index >= maxIndex) {
            clearInterval(timer);
        } else {
            index++;
        }

    }, 1000)
})
function heroWithBtnList() {
    let blocks = document.getElementsByClassName('block-hero-with-btn-list');

    function highlighCurrentSelected() {
        for (let i = 0; i < blocks.length; i++) {
            let items = blocks[i].getElementsByClassName("item");

            for(let i = 0; i < items.length; i++){
                var myEventHandler = function () {
                    for(let j = 0; j < items.length; j++){
                        items[j].classList.remove("current-selected");
                    }
                    items[i].classList.add("current-selected");
                };
                $(items[i]).unbind('click', myEventHandler);
                $(items[i]).bind('click', myEventHandler);
            }
        }
    }

    
    function buttonSlider() {
        for (let j = 0; j < blocks.length; j++) {
            let btnRight = blocks[j].getElementsByClassName("btn-right")[0];
            let btnLeft = blocks[j].getElementsByClassName("btn-left")[0];

            var myEventHandler = function () {
                $('.button-container', blocks[j]).animate( { scrollLeft: '+=100' }, 200);
            };
            $(btnRight).unbind('click', myEventHandler);
            $(btnRight).bind('click', myEventHandler);

            var myEventHandler = function () {
                $('.button-container', blocks[j]).animate( { scrollLeft: '-=100' }, 200);
            };
            $(btnLeft).unbind('click', myEventHandler);
            $(btnLeft).bind('click', myEventHandler);
        }
    }

    highlighCurrentSelected();
    buttonSlider();
}

if (document.querySelector('.block-hero-with-btn-list')) {
    heroWithBtnList();
}


let years;
fetch('/json/financial_statements/statements.json')
        .then(response => response.json())
        .then(data => {
            years = data;

            const dropdownOptionElement = document.querySelector('.block-affin-group-financial-information #statementYear');
            if (dropdownOptionElement) {
                dropdownOptionElement.innerHTML = '';
            }

            for (const [index, year] of years.entries()) {
                const financialStatementYearElement = document.createElement('option');
                financialStatementYearElement.setAttribute('value', year.year);
                financialStatementYearElement.innerText = year.year;

                if (index === years.length - 1) {
                    financialStatementYearElement.setAttribute('selected', true);
                }

                dropdownOptionElement.appendChild(financialStatementYearElement);
            }
        });

const searchFilter = document.querySelector('.block-affin-group-financial-information .statement-search-btn');
if (searchFilter) {
    searchFilter.addEventListener('click', function () {
        loadListingStatement(document.getElementById('statementYear').value);
    });
}

const reportSearchFilter = document.querySelector('.block-affin-group-financial-information .annual-search-btn');
if (reportSearchFilter) {
    reportSearchFilter.addEventListener('click', function () {
        loadAnnualReport(document.getElementById('annualReportYear').value);
    });
}

function switchAffinGroup3Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let tab of tabs) {
        if (!tabsChecker.includes(tab.className)) {
            tab.style.display = 'none';
            tabsChecker.push(tab.className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = 'block';
    }

    const headerTabs = document.querySelectorAll(`.${parentClassName} .tab-title`);
    if (headerTabs) {
        for (let tab of headerTabs) {
            tab.classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .tab-title.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab3FirstTab() {
    const allTabs = document.querySelectorAll('.block-affin-group-financial-information .tab');

    for (let tab of allTabs) {
        if (!tab.classList.contains('tab-1')) {
            tab.style.display = 'none';
        }
    }
}

function loadListingStatement(selectedYear) {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            language = lang

            const statements = $('.block-affin-group-financial-information .listingStatements')[0];

            if (statements) {
                statements.innerHTML = '';
            }

            for (let year of years) {
                const financialStatements = year.statements;

                if (selectedYear === year.year) {
                    for (let statement of financialStatements) {
                        let date;
                        let url;
                        let downloadText;
                        const img = 'https://admin.affinalways.com/img/financial-1.png';

                        switch (language) {
                            case 'ms':
                                date = statement.date_in_malay ?? statement.date_in_english;
                                url = statement.url_in_malay ?? statement.url_in_english;
                                downloadText = 'Muat Turun';
                                break;
                            case 'en':
                            default:
                                date = statement.date_in_english;
                                url = statement.url_in_english;
                                downloadText = 'Download';
                                break;
                        }

                        const statementsElement = document.createElement('div');

                        statementsElement.innerHTML = `<div class="card">
                            <img class="banner-image" src="${img}" alt="banner-image">
                            <div class="card-text">${date}</div>
                            <a class="card-download-text" href="${url}">${downloadText}</a>`;

                        if (statements) {
                            statements.appendChild(statementsElement);
                        }
                    }
                }
            }
        });
}

function loadAnnualReport(selectedYear) {
    let annualReportYears = [
        {
            "year": "2012",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2012-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2012-AIBB-AR-publication.pdf"
        },
        {
            "year": "2013",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2013-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2013-AIBB-AR-publication.pdf"
        },
        {
            "year": "2014",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2014-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2014-AIBB-AR-publication.pdf"
        },
        {
            "year": "2015",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2015-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2015-AIBB-AR-publication.pdf"
        },
        {
            "year": "2016",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2016-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2016-AIBB-AR-publication.pdf"
        }
    ];


    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            const reports = $('.block-affin-group-financial-information .listingAnnualReports')[0];

            if (reports) {
                reports.innerHTML = '';
            }

            for (let year of annualReportYears) {
                let img;
                let date;
                let annualReportUrl;
                let downloadText;

                switch (lang) {
                    case 'ms':
                        img = year.img_in_malay ?? year.img_in_english;
                        date = year.date_in_malay ?? year.date_in_english;
                        annualReportUrl = year.annualReportUrl_in_malay ?? year.annualReportUrl_in_english;
                        downloadText = 'Muat Turun';
                        break;
                    case 'en':
                    default:
                        img = year.img_in_english;
                        date = year.date_in_english;
                        annualReportUrl = year.annualReportUrl_in_english;
                        downloadText = 'Download';
                        break;
                }

                if (selectedYear === year.year) {

                    const statementsElement = document.createElement('div');

                    statementsElement.innerHTML = `<div class="annual-card">
                        <img src="${img}" alt="banner-image">'
                        <div class="card-text">${date}</div>
                        <a class="card-download-text" href="${annualReportUrl}">${downloadText}</a>`;

                    if (reports) {
                        reports.appendChild(statementsElement);
                    }
                }
            }
        });

}

ready(function () {
    if (document.querySelector('.block-affin-group-financial-information')) {
        switchTab3FirstTab();
        if (years) {
            loadListingStatement(years.slice(-1)[0].year);
        }
        loadAnnualReport('2016');
        fetch('/currentLang')
            .then(response => response.text())
            .then(lang => {

                let yearText;
                let searchText;

                switch (lang) {
                    case 'ms':
                        yearText = 'Tahun';
                        searchText = 'Cari';
                        break;
                    case 'en':
                    default:
                        yearText = 'Year';
                        searchText = 'Search';
                        break;
                }

                document.querySelector('.block-affin-group-financial-information .year-filter-text').innerHTML = yearText;
                document.querySelector('.block-affin-group-financial-information .statement-search-text').innerHTML = searchText;
                document.querySelector('.block-affin-group-financial-information .annual-year-text').innerHTML = yearText;
                document.querySelector('.block-affin-group-financial-information .annual-search-text').innerHTML = searchText;
            });
    }
});

function getA1addinProductListCategoryJson(lang) {
    fetch('/json/a1addin_product_list/categories.json')
        .then(response => response.json())
        .then(categories => {
            categories.sort(function (a, b) {
                return a.order - b.order;
            });

            for (let category of categories) {
                let title;
                let subtitle;
                let btnText;
                let img = category.img;
                let link;

                switch (lang) {
                    case 'ms':
                        title = category.title_in_malay ? category.title_in_malay : category.title_in_english;
                        subtitle = category.subtitle_in_malay ? category.subtitle_in_malay : category.subtitle_in_english;
                        btnText = category.button_text_in_malay ? category.button_text_in_malay : category.button_text_in_english;
                        link = '/bm/products?' + title;
                        break;
                    case 'zh':
                        title = category.title_in_chinese ? category.title_in_chinese : category.title_in_english;
                        subtitle = category.subtitle_in_chinese ? category.subtitle_in_chinese : category.subtitle_in_english;
                        btnText = category.button_text_in_chinese ? category.button_text_in_chinese : category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                    case 'en':
                        title = category.title_in_english;
                        subtitle = category.subtitle_in_english;
                        btnText = category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                    default:
                        title = category.title_in_english;
                        subtitle = category.subtitle_in_english;
                        btnText = category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                }

                const categoryTitle = document.createElement('DIV');
                categoryTitle.innerHTML =
                    '<div class="card category-card">' +
                    '<div class="row">' +
                    '<div class="col-4 place-self-center">' +
                    '<img src="' + img + '" alt="category image" class="product-category-image">' +
                    '</div>' +
                    '<div class="col-8 px-4">' +
                    '<p class="category-card-title-text">' + title + '</p>' +
                    '<p class="category-card-subtitle-text">' + subtitle + '</p>' +
                    '<a href="' + link + '" target="_blank" class="category-btn-link"><div class="category-btn">' + btnText + '</div></a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                categoryTitle.className = title.replaceAll(' ', '_') + ' col-12 col-lg-6 a1addin-product-category-' + category.id;
                categoryTitle.id = 'product-category-' + category.id;

                const categoryContainer = document.querySelector('.block-a1addin-product-list .product-categories');
                if (categoryContainer) {
                    categoryContainer.appendChild(categoryTitle);
                }
            }
            setProductCategoryLeftRightButton();
        });
}

function setProductCategoryLeftRightButton() {
    const nextBtn = document.querySelector('.block-a1addin-product-list .fa-chevron-right.a1addin-product-category-arrow-icon');
    const prevBtn = document.querySelector('.block-a1addin-product-list .fa-chevron-left.a1addin-product-category-arrow-icon');
    const card = document.querySelectorAll('.block-a1addin-product-list .category-card');

    let cardWidth;
    if (card) {
        cardWidth = card[0].offsetWidth + 50;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            $('.block-a1addin-product-list .product-categories').animate({scrollLeft: '+=' + cardWidth}, 200);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            $('.block-a1addin-product-list .product-categories').animate({scrollLeft: '-=' + cardWidth}, 200);
        });
    }
}

function pdsAccordion(id, parentClassName) {
    const firstCategory = document.querySelector('.' + parentClassName + ' #' + id);
    if (firstCategory) {
        firstCategory.classList.add('active');
    }

    const coll = document.querySelectorAll('.' + parentClassName + ' .pds-collapsible');
    let i, j;

    if (coll) {
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                for (let i = 0; i < this.childNodes.length; i++) {
                    const temp = this.childNodes[i];

                    if (temp instanceof Element) {
                        if (temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                }
            });
        }
    }

    const header_btn = document.querySelectorAll('.' + parentClassName + ' .pds-header-btn');
    const accordion_group = document.querySelectorAll('.' + parentClassName + ' .pds-accordion-group');

    for (let j = 0; j < accordion_group.length; j++) {
        accordion_group[j].style.display = 'none';
    }

    for (i = 0; i < header_btn.length; i++) {
        if (i < 1) {
            accordion_group[i].style.display = "block";
        } else {
            accordion_group[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-t-n-c')) {
    pdsAccordion();
}

function initCareerBlock() {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            appendSpecializationElements(lang);
            appendLocationElements(lang);
            getCareerElements(lang);
            initLoadMoreCareerButton(lang);
            if (lang === 'ms') {
                const searchTitleInputElement = document.querySelector('.block-affin-group-career #position-title');
                if (searchTitleInputElement) {
                    searchTitleInputElement.setAttribute('placeholder', 'Gelaran jawatan...');
                }

                const hiringTextElement = document.querySelector('.block-affin-group-career .hiring-text');
                if (hiringTextElement) {
                    hiringTextElement.innerHTML = 'Kami sedang mengupah!';
                }
            }
        });
}

function appendSpecializationElements(lang) {
    fetch('/json/affin_group_career/specializations.json')
        .then(response => response.json())
        .then(specializations => {
            for (let specialization of specializations) {
                let name;
                switch (lang) {
                    case 'zh':
                        name = specialization.name_in_chinese ? specialization.name_in_chinese : specialization.name_in_english;
                        break;
                    case 'ms':
                        name = specialization.name_in_malay ? specialization.name_in_malay : specialization.name_in_english;
                        const defaultSpecializationOption = document.querySelector('.block-affin-group-career #default-specialization');
                        if (defaultSpecializationOption) {
                            defaultSpecializationOption.innerHTML = 'Pengkhususan';
                        }
                        break;
                    case 'en':
                    default:
                        name = specialization.name_in_english;
                        break;
                }
                const specializationDropdownOptionElement = document.createElement('OPTION');
                specializationDropdownOptionElement.value = specialization.id;
                specializationDropdownOptionElement.innerHTML = name;
                const specializationDropdownElement = document.querySelector('.block-affin-group-career .career-specialization-dropdown');
                if (specializationDropdownElement) {
                    specializationDropdownElement.appendChild(specializationDropdownOptionElement);
                }
            }
        });
}

function appendLocationElements(lang) {
    fetch('/json/affin_group_career/locations.json')
        .then(response => response.json())
        .then(locations => {
            for (let location of locations) {
                let locationName;
                switch (lang) {
                    case 'zh':
                        locationName = location.location_in_chinese ? location.location_in_chinese : location.location_in_english;
                        break;
                    case 'ms':
                        locationName = location.location_in_malay ? location.location_in_malay : location.location_in_english;
                        const defaultLocationOption = document.querySelector('.block-affin-group-career #default-location');
                        if (defaultLocationOption) {
                            defaultLocationOption.innerHTML = 'Lokasi';
                        }
                        break;
                    case 'en':
                    default:
                        locationName = location.location_in_english;
                        break;
                }
                const locationDropdownOptionElement = document.createElement('OPTION');
                locationDropdownOptionElement.value = location.id;
                locationDropdownOptionElement.innerHTML = locationName;
                const locationDropdownElement = document.querySelector('.block-affin-group-career .career-location-dropdown');
                if (locationDropdownElement) {
                    locationDropdownElement.appendChild(locationDropdownOptionElement);
                }
            }
        });
}

function getCareerElements(lang) {
    fetch('/json/affin_group_career/careers.json')
        .then(response => response.json())
        .then(careers => {
            careers.sort(function (a, b) {
                return a.order - b.order;
            });
            appendCareerElements(lang, careers, true);
        });
}

function appendCareerElements(lang, careers, isInitSearchButtonRequired) {
    for (let career of careers) {
        let title;
        let division;
        let specialization;
        let location;
        let careerLink;
        switch (lang) {
            case 'zh':
                title = career.title_in_chinese ? career.title_in_chinese : career.title_in_english;
                division = career.division_in_chinese ? career.division_in_chinese : career.division_in_english;
                specialization = career.specialization_in_chinese ? career.specialization_in_chinese : career.specialization_in_english;
                location = career.location_in_chinese ? career.location_in_chinese : career.location_in_english;
                break;
            case 'ms':
                title = career.title_in_malay ? career.title_in_malay : career.title_in_english;
                division = career.division_in_malay ? career.division_in_malay : career.division_in_english;
                specialization = career.specialization_in_malay ? career.specialization_in_malay : career.specialization_in_english;
                location = career.location_in_malay ? career.location_in_malay : career.location_in_english;
                careerLink = '/bm/affin-group-career?v=' + btoa('careerId=' + career.id);
                break;
            case 'en':
            default:
                title = career.title_in_english;
                division = career.division_in_english;
                specialization = career.specialization_in_english;
                location = career.location_in_english;
                careerLink = '/affin-group-career?v=' + btoa('careerId=' + career.id);
                break;
        }
        const careerListElement = document.createElement('DIV');
        careerListElement.innerHTML = '<div class="col-12 col-md-3">' +
            '<a href="' + careerLink + '" class="career-list-title-link" target="_blank">' +
            '<p class="career-list-title">' + title + '</p>' +
            '</a>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-division-text">' + division + '</p>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-specialization-text">' + specialization + '</p>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-location-list">' + location + '</p>' +
            '</div>';
        careerListElement.classList.add('row', 'career-list', 'hide-career-list');
        const careerListContainer = document.querySelector('.block-affin-group-career .career-list-container');
        if (careerListContainer) {
            careerListContainer.appendChild(careerListElement);
        }
    }
    const $hiddenCareerList = $(".hide-career-list:hidden");
    $hiddenCareerList.slice(0, 10).removeClass('hide-career-list');
    if (isInitSearchButtonRequired === true) {
        initSearchButton(lang, careers);
    }
}

function initSearchButton(lang, careers) {
    let filteredCareerArray;
    const searchButton = document.querySelector('.block-affin-group-career #career-search-button');
    if (searchButton) {
        if (lang === 'ms') {
            searchButton.innerHTML = 'Cari';
        }
        searchButton.addEventListener('click', function () {
            filteredCareerArray = [];
            const careerListContainer = document.querySelector('.block-affin-group-career .career-list-container');
            if (careerListContainer) {
                careerListContainer.innerHTML = '';
            }
            const careerTitleInput = document.querySelector('.block-affin-group-career #position-title');
            if (careerTitleInput) {
                const careerTitleInputValue = careerTitleInput.value;
                for (let career of careers) {
                    let title;
                    switch (lang) {
                        case 'zh':
                            title = career.title_in_chinese ? career.title_in_chinese : career.title_in_english;
                            break;
                        case 'ms':
                            title = career.title_in_malay ? career.title_in_malay : career.title_in_english;
                            break;
                        case 'en':
                        default:
                            title = career.title_in_english;
                            break;
                    }
                    if (careerTitleInputValue !== null && careerTitleInputValue !== '' && careerTitleInputValue !== ' ') {
                        const regex = new RegExp(careerTitleInputValue, 'gi');
                        const isTitleMatch = regex.test(title);
                        if (isTitleMatch) {
                            filteredCareerArray.push(career);
                        }
                    } else {
                        filteredCareerArray.push(career);
                    }
                }
            }
            const careerSpecializationInput = document.querySelector('.block-affin-group-career #career-specialization');
            if (careerSpecializationInput) {
                const careerSpecializationInputValue = careerSpecializationInput.value;
                if (careerSpecializationInputValue !== null && careerSpecializationInputValue !== '') {
                    filteredCareerArray = filteredCareerArray.filter(career => career.specialization_id === parseInt(careerSpecializationInputValue));
                }
            }
            const careerLocationInput = document.querySelector('.block-affin-group-career #career-location');
            if (careerLocationInput) {
                const careerLocationInputValue = careerLocationInput.value;
                if (careerLocationInputValue !== null && careerLocationInputValue !== '') {
                    filteredCareerArray = filteredCareerArray.filter(career => career.location_id === parseInt(careerLocationInputValue));
                }
            }
            const noResultTextElement = document.querySelector('.block-affin-group-career .no-result-text');
            const loadMoreCareerButton = document.querySelector('.block-affin-group-career .load-more-career-btn');
            if (noResultTextElement && loadMoreCareerButton) {
                if (lang === 'ms') {
                    noResultTextElement.innerHTML = 'Tiada Keputusan...';
                }

                if (filteredCareerArray.length === 0) {
                    noResultTextElement.style.display = 'block';
                    loadMoreCareerButton.style.display = 'none';
                } else {
                    noResultTextElement.style.display = 'none';
                    loadMoreCareerButton.style.display = 'inline-block';
                }
            }
            appendCareerElements(lang, filteredCareerArray, false);
        })
    }
}

function initLoadMoreCareerButton(lang) {
    const loadMoreCareerButton = document.querySelector('.block-affin-group-career .load-more-career-btn');
    if (loadMoreCareerButton) {
        if (lang === 'ms') {
            loadMoreCareerButton.innerHTML = 'Tambah lagi';
        }
        loadMoreCareerButton.addEventListener('click', function () {
            const $hiddenCareerList = $(".hide-career-list:hidden");
            $hiddenCareerList.slice(0, 5).removeClass('hide-career-list');
            if ($hiddenCareerList.length === 0) {
                loadMoreCareerButton.style.display = 'none';
            }
        })
    }
}
