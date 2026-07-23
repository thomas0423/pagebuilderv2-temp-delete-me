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
