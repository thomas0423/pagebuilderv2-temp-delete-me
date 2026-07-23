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
            if (location.hostname === 'www.a1addin.com' || location.hostname === 'admin.a1addin.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan A1addin.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            } else if (location.hostname === 'www.affinalways.com' || location.hostname === 'admin.affinalways.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan AffinAlways.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            } else if (location.hostname === 'www.affingroup.com' || location.hostname === 'admin.affingroup.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">Anda bakal meninggalkan AffinGroup.com</p>' +
                    '<p>Harap maklum bahawa penggunaan polisi privasi AFFIN BANK akan dihentikan selepas anda masuk ke laman web parti ketiga. Maka, anda dinasihatkan agar membaca polisi privasi laman web tersebut. AFFIN BANK tidak memberi sebarang jaminan untuk keseluruhan, ketepatan atau keselamatan Pihak Ketiga dan mana-mana kandungannya.' +
                    '</p>' +
                    '<p>Oleh itu, AFFIN BANK tidak akan dipertanggungjawabkan atau bertanggungjawab bagi kandungan laman web pihak ketiga berkenaan atau apa-apa akibat daripada akses ke Laman web tersebut.</p>';
            }
        } else {
            if (location.hostname === 'www.a1addin.com' || location.hostname === 'admin.a1addin.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving A1addin.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK\'s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            } else if (location.hostname === 'www.affinalways.com' || location.hostname === 'admin.affinalways.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving AffinAlways.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK\'s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            } else if (location.hostname === 'www.affingroup.com' || location.hostname === 'admin.affingroup.com') {
                externalLinkDisclaimerText.innerHTML = '<p class="margin-top-20-px">You are now leaving AffinGroup.com</p>' +
                    '<p>Please be informed that upon entering a third party website, AFFIN BANK\'s privacy policy ceases to apply and you are advised to read the privacy policies of the third party website. AFFIN BANK gives no warranty as to the entirety, accuracy or security of the linked third party website or any of its content.' +
                    '</p>' +
                    '<p>As such, AFFIN BANK shall not be responsible or liable in connection with the content of or the consequences of accessing the third party website.</p>';
            }
        }
    }
}

function a1addinCopyrightInBM(lang) {
    if (location.hostname !== '' && location.hostname !== null && location.href !== 'about:blank') {
        if (lang === 'ms' && (location.hostname === 'www.a1addin.com' || location.hostname === 'admin.a1addin.com')) {
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
                    footerUrl[4].innerHTML = 'Risalah DIS PIDM';
                    footerUrl[4].href = 'https://www.affinalways.com/storage/AffinAlways%20Collaterals/Personal%20Collaterals/Deposit%20Conventional/Brochure-PIDM-BM.pdf';
                    footerUrl[5].innerHTML = 'Senarai Deposit Yang Diinsurankan';
                    footerUrl[5].href = 'https://www.affinalways.com/bm/list-of-insured-deposits';
                }
            }, 1000);
        }
    }
}


if (location.hostname === 'www.affinalways.com') {
    window.ymConfig = { bot: 'x1675230655642', host: 'https://chatbot.affinalways.com' };  (function () {var w=window,ic=w.YellowMessenger;if("function"===typeof ic)ic("reattach_activator"),ic("update",ymConfig);else{var d=document,i=function(){i.c(arguments)};function l(){var e=d.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://chatbot.affinalways.com/assets/plugin/widget-v2/latest/dist/main.min.js";var t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}i.q=[],i.c=function(e){i.q.push(e)},w.YellowMessenger=i,w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}})();
}

if (location.hostname === 'www.affinalways.com') {
    const auraCampaignScriptElement = document.createElement('script');
    auraCampaignScriptElement.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5WNMR3XG');
    `;

    const auraCampaignNoscriptElement = document.createElement('noscript');
    auraCampaignNoscriptElement.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5WNMR3XG"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;

    document.head.appendChild(auraCampaignScriptElement);
    document.body.insertBefore(auraCampaignNoscriptElement, document.body.firstChild);

    const gtmScriptElement = document.createElement('script');
    gtmScriptElement.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5L6GR3B');
    `;

    const gtmNoscriptElement = document.createElement('noscript');
    gtmNoscriptElement.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5L6GR3B"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;

    document.head.appendChild(gtmScriptElement);
    document.body.insertBefore(gtmNoscriptElement, document.body.firstChild);
}

const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = 'https://www.affinalways.com/storage/script/customerCare.css';
document.head.appendChild(cssLink);

const script = document.createElement('script');
script.src = 'https://www.affinalways.com/storage/script/customerCare.js';
script.defer = true;
document.head.appendChild(script);

const ymDivBarElement = document.querySelector('#ymDivBar');
if (ymDivBarElement) {
  ymDivBarElement.style.display = 'none';
}
