function setDiscoverPromotionWithIconAllLoadMore(parentClassName,load_btn) {
    let itemClassName = "col-6 col-lg-3 mt-5";
    let items = parentClassName.getElementsByClassName(itemClassName);
    let totalItems = items.length;
    let numberProductsToDisplay;
    let displayListStart;
    let displayListEnd;
    // let previousdisplayListStart;
    // let previousdisplayListEnd;
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
        mobileProductsToShow = 12;
        tabletProductsToShow = 12;
        desktopProductsToShow = 12;
        // previousdisplayListStart = 0;
        // previousdisplayListEnd = 0;

        if (mobile.matches) { // MOBILE
            numberProductsToDisplay = mobileProductsToShow;
            displayListEnd = numberProductsToDisplay;
        } else if (tablet.matches) { // TABLET
            numberProductsToDisplay = tabletProductsToShow;
            displayListEnd = numberProductsToDisplay;
        } else { // DESKTOP
            numberProductsToDisplay = desktopProductsToShow;
            displayListEnd = numberProductsToDisplay;
        }
    }

    function initCarousel() {
        if(totalItems >= numberProductsToDisplay) {
            $('.load-more-btn', load_btn).show();
        }else{
            $('.load-more-btn', load_btn).hide();
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
        var showMoreBtn = load_btn.getElementsByClassName("load-more-btn")[0];

        if (showMoreBtn){
            showMoreBtn.addEventListener('click', loadMore);
        }
    }

    function loadMore() {
        let tempNext = displayListEnd + numberProductsToDisplay;
        if (tempNext >= totalItems){
            displayListStart = displayListEnd + 1;
            displayListEnd = totalItems;

            $('.load-more-btn', load_btn).hide();
        }else{
            displayListStart = displayListEnd + 1;
            displayListEnd += numberProductsToDisplay;
        }

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
