function mediaGalleryVideoMain(lang, parentBlockUniqueIdentifier) {
    let startPage = 1; // start page always first page
    let numberPagesToShow; // Number of pages to be show in the list
    let numberDataToShowPerPage; // Number of datas in the table to be show in a page
    let headerDataHolder; // Header datas
    let allVideoHolder = []; // All songs data
    let allVideoHolderHtml = []; // All songs data in html
    const mediaGalleryVideoContent = document.querySelector('.' + parentBlockUniqueIdentifier + ' .block-overall-content-y-padding');

    fetch('/json/media-gallery-video/index.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].filepath === 'media_gallery_video.json') {
                    let jsonFileName = data[i].filepath;
                    generateMediaGalleryVideoContent(jsonFileName);
                    break;
                }
            }
        }
    });

    function generateMediaGalleryVideoContent(jsonFileName) {
        fetch('/json/media-gallery-video/' + jsonFileName)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // BLOCK HEADER DATAs
                let tempVideoTitleText;

                switch (lang) {
                    case 'zh':
                        tempVideoTitleText = "视频";
                        break;
                    case 'ms':
                        tempVideoTitleText = "Video";
                        break;
                    case 'en':
                    default:
                        tempVideoTitleText = "Video";
                        break;
                }

                headerDataHolder = {
                    'videoTitleText': tempVideoTitleText
                }

                // BLOCK CONTENT DATAs
                let tempVideoCategoryId;
                let tempVideoCategory;
                let tempVideoId;
                let tempVideoThumbnail;
                let tempVideoName;
                let tempVideoCardUrl;
                let tempVideoHolder;
   
                for (let i = 0; i < data.length; i++) {
                    tempVideoCategoryId = data[i].id;

                    switch (lang) {
                        case 'zh':
                            tempVideoCategory = data[i].title_in_chinese ? data[i].title_in_chinese : data[i].title_in_english;
                            break;
                        case 'ms':
                            tempVideoCategory = data[i].title_in_malay ? data[i].title_in_malay : data[i].title_in_english;
                            break;
                        case 'en':
                        default:
                            tempVideoCategory = data[i].title_in_english;
                            break;
                    }

                    for (let j = 0; j < data[i].data.length; j++) {
                        tempVideoId = data[i].data[j].id;

                        switch (lang) {
                            case 'zh':
                                tempVideoName = data[i].data[j].title_in_chinese ? data[i].data[j].title_in_chinese : data[i].data[j].title_in_english;
                                break;
                            case 'ms':
                                tempVideoName = data[i].data[j].title_in_malay ? data[i].data[j].title_in_malay : data[i].data[j].title_in_english;
                                break;
                            case 'en':
                            default:
                                tempVideoName = data[i].data[j].title_in_english;
                                break;
                        }

                        tempVideoThumbnail = data[i].data[j].thumbnail;
                        tempVideoCardUrl = '/media-gallery-video/' + encodeURIComponent(tempVideoCategory) + '?v=' + btoa('cat=' + tempVideoCategoryId + '&rec=' + tempVideoId);

                        tempVideoHolder = {
                            'videoCategoryId': tempVideoCategoryId,
                            'videoCategory': tempVideoCategory,
                            'videoId': tempVideoId,
                            'videoThumbnail': tempVideoThumbnail,
                            'videoName': tempVideoName,
                            'videoCardUrl': tempVideoCardUrl
                        }

                        allVideoHolder.push(tempVideoHolder);
                    }
                }
                
                // Generating the html elements of the block
                createMediaGalleryVideoContent();
            }
        });
    }

    // Generating the html elements of the block
    function createMediaGalleryVideoContent() {
        createMediaGalleryVideoContentHeader();
        createMediaGalleryVideoContentBody();
    }

    // Creating html elements for the block header title etc
    function createMediaGalleryVideoContentHeader() {
        const mediaGalleryVideoHeaderContentRow = document.createElement('DIV'); 
        mediaGalleryVideoHeaderContentRow.className = "row";
        const mediaGalleryVideoHeaderContentCol = document.createElement('DIV'); 
        mediaGalleryVideoHeaderContentCol.className = "col-12";

        const videoTitleHtml = document.createElement('P');
        videoTitleHtml.className = "video-title";
        videoTitleHtml.innerHTML = headerDataHolder.videoTitleText;

        mediaGalleryVideoHeaderContentCol.appendChild(videoTitleHtml);
        mediaGalleryVideoHeaderContentRow.appendChild(mediaGalleryVideoHeaderContentCol);
        mediaGalleryVideoContent.appendChild(mediaGalleryVideoHeaderContentRow);
    }

    // Creating html elements for the block contents
    function createMediaGalleryVideoContentBody() {
        const mediaGalleryVideoContentBodyRow = document.createElement('DIV'); 
        mediaGalleryVideoContentBodyRow.className = "row";

        for (let i = 0; i < allVideoHolder.length; i++) {
            const mediaGalleryVideoCardCol = document.createElement('DIV');
            mediaGalleryVideoCardCol.className = "col-12 col-lg-4 col-md-6 mt-4 video-card-col";
            mediaGalleryVideoCardCol.innerHTML = '<a href="' + allVideoHolder[i].videoCardUrl + '" class="video-card-link ">' +
                '<div class="card">' +
                '<img src="' + allVideoHolder[i].videoThumbnail + '" class="video-card-thumbnail" alt="thumbnail">' +
                '<div class="card-body text-center">' +
                '<p class="card-title-text">' + allVideoHolder[i].videoCategory + " - " + allVideoHolder[i].videoName + '</p>' +
                '</div>' +
                '</div>' +
                '</a>';
            
            mediaGalleryVideoContentBodyRow.appendChild(mediaGalleryVideoCardCol);
            allVideoHolderHtml.push(mediaGalleryVideoCardCol);
        }
        
        mediaGalleryVideoContent.appendChild(mediaGalleryVideoContentBodyRow);

        mediaSizeChecker();
    }

    // Create Pagination Html Elemetns and functions for the table
    function paginateMediaGalleryVideoContentBody(videos) {
        if ($('.' + parentBlockUniqueIdentifier + ' .pagination-row')) {
            $('.' + parentBlockUniqueIdentifier + ' .pagination-row').remove();
        }
        
        // Creating the pages row and col and wrappers
        const paginationContentRow = document.createElement('DIV');
        paginationContentRow.className = "row pagination-row";
        const paginationContentCol = document.createElement('DIV');
        paginationContentCol.className = "col-12";

        const paginationWrapperHtml = document.createElement('DIV');
        paginationWrapperHtml.className = "pagination-wrapper";
        const pagesWrapperHtml = document.createElement('DIV');
        pagesWrapperHtml.className = "pages-wrapper";

        paginationContentCol.appendChild(paginationWrapperHtml);
        paginationContentRow.appendChild(paginationContentCol);
        mediaGalleryVideoContent.appendChild(paginationContentRow);

        var totalData = videos.length;
        var totalPages = Math.ceil(totalData/numberDataToShowPerPage); // Round up the number if have decimal

        // Creating the pagination pages, and shortcut
        if (totalPages > numberPagesToShow) {
            const firstPageHtml = document.createElement('a');
            firstPageHtml.setAttribute("href", "#99");
            firstPageHtml.setAttribute("data-value", "first");
            firstPageHtml.className = "pagination-shortcut";
            firstPageHtml.innerHTML = "<<";
            firstPageHtml.addEventListener("click", function() {
                var currentSelectedPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').attr('data-value');
                var firstPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page:first');

                // Check if current selected page not first page
                if (currentSelectedPage > "1") {
                    // If firstpage page is not shown, re-display showing page list
                    if (!firstPage.hasClass("active-pages")) {
                        displayCorrespodingPages((startPage - 1), numberPagesToShow);
                    }

                    // Check for shortcut keys, display accordingly
                    checkShortCutButtons(firstPage, totalPages);

                     // Re-display the table data
                    displaySelectedPageData(firstPage, videos);     
                }               
            });

            const previousPageHtml = document.createElement('a');
            previousPageHtml.setAttribute("href", "#99");
            previousPageHtml.setAttribute("data-value", "previous");
            previousPageHtml.className = "pagination-shortcut";
            previousPageHtml.innerHTML = "<";
            previousPageHtml.addEventListener("click", function() {
                var currentSelectedPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').attr('data-value');
                var previousPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').prev();

                // Check if next page not last page
                if (currentSelectedPage > startPage) {
                    // If first page is not shown, re-display showing page list
                    if (!previousPage.hasClass("active-pages")) {
                        displayCorrespodingPages((previousPage.attr('data-value') - 1), (previousPage.attr('data-value') - 1) + numberPagesToShow);
                    }

                    // Check for shortcut keys, display accordingly
                    checkShortCutButtons(previousPage, totalPages);

                    // Re-display the table data
                    displaySelectedPageData(previousPage, videos);     
                }               
            });
          
            const nextPageHtml = document.createElement('a');
            nextPageHtml.setAttribute("href", "#99");
            nextPageHtml.className = "pagination-shortcut";
            nextPageHtml.setAttribute("data-value", "next");
            nextPageHtml.innerHTML = ">";
            nextPageHtml.addEventListener("click", function() {  
                var currentSelectedPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').attr('data-value');
                var nextPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').next();

                // Check if next page not last page
                if (currentSelectedPage < totalPages) {
                    // If first page is not shown, re-display showing page list
                    if (!nextPage.hasClass("active-pages")) {
                        displayCorrespodingPages((nextPage.attr('data-value') - numberPagesToShow), nextPage.attr('data-value'));                        
                    } 

                    // Check for shortcut keys, display accordingly
                    checkShortCutButtons(nextPage, totalPages);

                    // Re-display the table data
                    displaySelectedPageData(nextPage, videos);     
                }               
            });

            const lastPageHtml = document.createElement('a');
            lastPageHtml.setAttribute("href", "#99");
            lastPageHtml.setAttribute("data-value", "last");
            lastPageHtml.className = "pagination-shortcut";
            lastPageHtml.innerHTML = ">>";
            lastPageHtml.addEventListener("click", function() {  
                var currentSelectedPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').attr('data-value');
                var lastPage = $('.' + parentBlockUniqueIdentifier + ' .pagination-page:last');

                // Check if current selected page not first page
                if (currentSelectedPage < totalPages) {
                    // If first page is not shown, re-display showing page list
                    if (!lastPage.hasClass("active-pages")) {
                        displayCorrespodingPages((totalPages - numberPagesToShow), totalPages);
                    }

                    // Check for shortcut keys, display accordingly
                    checkShortCutButtons(lastPage, totalPages);

                     // Re-display the table data
                    displaySelectedPageData(lastPage, videos);     
                }               
            });

            paginationWrapperHtml.appendChild(firstPageHtml);
            paginationWrapperHtml.appendChild(previousPageHtml);
            paginationWrapperHtml.appendChild(pagesWrapperHtml);
            paginationWrapperHtml.appendChild(nextPageHtml);
            paginationWrapperHtml.appendChild(lastPageHtml);
        } else {
            paginationWrapperHtml.appendChild(pagesWrapperHtml);
        }

        if (totalData > 0) {
            for(i = 0; i < totalPages; i++) {
                var pageNum = i + 1;

                const page = document.createElement('a');
                page.setAttribute("href", "#99");
                page.setAttribute("data-value", pageNum);
                page.className = "pagination-page";
                page.innerHTML = pageNum;
                page.addEventListener("click", function() {
                    if (!$(this).hasClass("selected-page")) {
                        checkShortCutButtons($(this), totalPages);
                        displaySelectedPageData($(this), videos);
                    }
                });
                
                pagesWrapperHtml.appendChild(page);
            }

            displayCorrespodingPages((startPage - 1), numberPagesToShow);
            checkShortCutButtons($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), totalPages);
            displaySelectedPageData($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), videos);
        }
    }

    function displayCorrespodingPages(startPage, endPage) {  
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.active-pages').removeClass("active-pages");
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page').slice(startPage, endPage).addClass("active-pages");
    }

    function displaySelectedPageData(selectedPage, videos) {
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').removeClass('selected-page'); // Remove previous selected page
        $(selectedPage).addClass('selected-page'); // Make this current selected page

        var page = $(selectedPage).attr('data-value');
        var startItem = (page - 1) * numberDataToShowPerPage;
        var endItem = startItem + numberDataToShowPerPage;

        $('.' + parentBlockUniqueIdentifier + ' .video-card-col.video-card-col-selected').removeClass("video-card-col-selected");
        $(videos).slice(startItem, endItem).addClass("video-card-col-selected");
    }

    function checkShortCutButtons(selectedPage, totalPages) {
        var page = $(selectedPage).attr('data-value');

        if (totalPages > numberPagesToShow) {
            if (parseInt(page) === startPage) { 
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=first]').removeClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=previous]').removeClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=next]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=last]').addClass("display-block");
            } else if (parseInt(page) === totalPages) {
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=first]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=previous]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=next]').removeClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=last]').removeClass("display-block");
            } else {
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=first]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=previous]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=next]').addClass("display-block");
                $('.' + parentBlockUniqueIdentifier + ' .pagination-shortcut[data-value=last]').addClass("display-block");
            }
        }
    }

    function mediaSizeChecker() {
        var mobile = window.matchMedia("(max-width: 767px)");
        var tablet = window.matchMedia("(max-width: 1023px)");

        mobileNumberPagesToShow = 3;
        tabletNumberPagesToShow = 4;
        desktopNumberPagesToShow = 5;
        mobileNumberDataToShowPerPage = 3;
        tabletNumberDataToShowPerPage = 6;
        desktopNumberDataToShowPerPage = 9;

        if (mobile.matches) { // MOBILE
            numberPagesToShow = mobileNumberPagesToShow;
            numberDataToShowPerPage = mobileNumberDataToShowPerPage;
        } else if (tablet.matches) { // TABLET
            numberPagesToShow = tabletNumberPagesToShow;
            numberDataToShowPerPage = tabletNumberDataToShowPerPage;
        } else { // DESKTOP
            numberPagesToShow = desktopNumberPagesToShow;
            numberDataToShowPerPage = desktopNumberDataToShowPerPage;
        }

        paginateMediaGalleryVideoContentBody(allVideoHolderHtml);
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
    });
}