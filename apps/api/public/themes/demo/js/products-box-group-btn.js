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
