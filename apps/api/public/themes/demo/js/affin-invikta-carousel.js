function initAffinInviktaCarousel(affinInviktaCarouselBlockElement) {
    const carouselClassName = 'col-lg-4 col-md-6 col-12 carousel-photo';
    const carouselElements = affinInviktaCarouselBlockElement.querySelectorAll('.carousel-photo');
    const prevButtonElement = affinInviktaCarouselBlockElement.querySelector('.carousel-prev-button');
    const nextButtonElement = affinInviktaCarouselBlockElement.querySelector('.carousel-next-button');
    const totalItems = carouselElements.length;
    let activeSlides;
    let slideLeft;
    let slideRight;

    function setClasses(previous, firstActive, next) {
        if (carouselElements[previous]) {
            carouselElements[previous].classList.add('prev');
        }
        if (carouselElements[firstActive]) {
            carouselElements[firstActive].classList.add('active');
        }
        for (let i = 1; i < activeSlides; i++) {
            if (carouselElements[slideLeft + i]) {
                carouselElements[slideLeft + i].classList.add('active');
            }
        }
        if (carouselElements[next]) carouselElements[next].classList.add('next');
    }

    function setEventListeners() {
        const nextButtonElement = affinInviktaCarouselBlockElement.querySelector('.carousel-next-button');
        const prevButtonElement = affinInviktaCarouselBlockElement.querySelector('.carousel-prev-button');
        nextButtonElement.addEventListener('click', moveNext);
        prevButtonElement.addEventListener('click', movePrev);
    }

    function moveNext() {
        if (slideRight === (totalItems - 1)) {
            slideLeft = 0;
        } else {
            slideLeft = (slideLeft < totalItems - 1) ? slideLeft += 1 : slideLeft += 0;
        }

        prevButtonElement.classList.remove('d-none');

        if (totalItems - activeSlides === slideLeft) {
            nextButtonElement.classList.add('d-none');
        } else {
            nextButtonElement.classList.remove('d-none');
        }

        moveCarouselTo(slideLeft);
    }

    function movePrev() {
        if (slideLeft === 0) {
            slideLeft = (totalItems - activeSlides);
        } else {
            slideLeft = (slideLeft > 0) ? slideLeft -= 1 : 0;
        }

        nextButtonElement.classList.remove('d-none');

        if (slideLeft === 0) {
            prevButtonElement.classList.add('d-none');
        } else {
            prevButtonElement.classList.remove('d-none');
        }

        moveCarouselTo(slideLeft);
    }

    function moveCarouselTo(slideLeft) {
        slideRight = slideLeft + activeSlides - 1;
        const newPrevious = (slideLeft !== 0) ? slideLeft - 1 : totalItems - 1;
        const newNext = (slideRight !== totalItems - 1) ? slideRight + 1 : 0;

        for (let item of carouselElements) {
            item.className = carouselClassName;
        }

        setClasses(newPrevious, slideLeft, newNext);
    }

    function initCarousel() {
        if (totalItems <= 3) {
            prevButtonElement.classList.add('d-none');
            nextButtonElement.classList.add('d-none');
        } else {
            prevButtonElement.classList.add('d-none');
            nextButtonElement.classList.remove('d-none');

            if (activeSlides === 1 && totalItems > 1 || activeSlides === 2 && totalItems > 2) {
                nextButtonElement.classList.remove('d-none');
            }
        }
        setClasses(totalItems - 1, 0, activeSlides);
    }

    function mediaSizeChecker() {
        const mobile = window.matchMedia('(max-width: 767px)');
        const tablet = window.matchMedia('(max-width: 1023px)');

        if (mobile.matches) {
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

if (document.querySelector('.block-affin-invikta-carousel')) {
    const affinInviktaCarouselBlockElement = document.querySelector('.block-affin-invikta-carousel');
    initAffinInviktaCarousel(affinInviktaCarouselBlockElement);
}
