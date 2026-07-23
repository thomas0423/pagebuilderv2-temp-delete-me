function setDiscoverPromotionWithIconCarousel(parentClassName, TitleID) {
    let itemClassName = "col-10 col-lg-3 col-md-6 offset-1 offset-md-0 pb-5";
    let items = parentClassName.getElementsByClassName(itemClassName);
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
        desktopProductsToShow = 4;
        previousdisplayListStart = 0;
        previousdisplayListEnd = 0;

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
        // Hide the buttons if displaylist is <= to total available items
        if(totalItems <= numberProductsToDisplay) {
            $('.another-coursel-button-next', TitleID).css('pointer-events', 'none');
            $('.another-coursel-button-prev', TitleID).css('pointer-events', 'auto');
        }else{
            
            if(carouselMode == 0){
                $('.another-coursel-button-next', TitleID).css('pointer-events', 'none');
                $('.another-coursel-button-next', TitleID).css('pointer-events', 'auto');
            }else if(carouselMode == 1){
                $('.another-coursel-button-next', TitleID).css('pointer-events', 'auto');
                $('.another-coursel-button-next', TitleID).css('pointer-events', 'auto');
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
        var next = TitleID.getElementsByClassName('another-coursel-button-next')[0],
            prev = TitleID.getElementsByClassName('another-coursel-button-prev')[0];

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
                $('.another-coursel-button-next', TitleID).css('pointer-events', 'none');;
            }

            // If first product list is not the first one, show prev btn
            if(displayListStart != 1){
                $('.another-coursel-button-prev', TitleID).css('pointer-events', 'auto');
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
                $('.another-coursel-button-prev', TitleID).css('pointer-events', 'none');;
            }

            $('.another-coursel-button-next', TitleID).css('pointer-events', 'auto');;

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