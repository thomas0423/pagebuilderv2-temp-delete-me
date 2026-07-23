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
