function mediaGalleryPhotoAlbumMain(lang, parentBlockUniqueIdentifier) {
    let startPage = 1; // start page always first page
    let numberPagesToShow; // Number of pages to be show in the list
    let numberDataToShowPerPage; // Number of datas in the table to be show in a page
    let headerDataHolder; // Header datas
    let allEventDataHolder = []; // All songs data
    let allEventDataHolderHtml = []; // All songs data in html
    const mediaGalleryPhotoAlbumContent = document.querySelector('.' + parentBlockUniqueIdentifier + ' .block-overall-content-y-padding');
    
    fetch('/json/media-gallery-photo-album/index.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].filepath === 'media_gallery_photo_album.json') {
                    let jsonFileName = data[i].filepath;
                    generateMediaGalleryPhotoAlbumContent(jsonFileName);
                    break;
                }
            }
        }
    });

    function generateMediaGalleryPhotoAlbumContent(jsonFileName) {
        fetch('/json/media-gallery-photo-album/' + jsonFileName)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // BLOCK HEADER DATAs
                let tempPhotoAlbumTitleText;
                let tempTableEventTitleText;
                let tempTableDateText;
                
                switch (lang) {
                    case 'zh':
                        tempPhotoAlbumTitleText = "企业活动";
                        tempTableEventTitleText = "活动名称";
                        tempTableDateText = "日期";
                        break;
                    case 'ms':
                        tempPhotoAlbumTitleText = "Acara Korporat";
                        tempTableEventTitleText = "Tajuk Peristiwa";
                        tempTableDateText = "Tarikh";
                        break;
                    case 'en':
                    default:
                        tempPhotoAlbumTitleText = "Corporate Events";
                        tempTableEventTitleText = "Event Title";
                        tempTableDateText = "Date";
                        break;
                }

                headerDataHolder = {
                    'photoAlbumTitleText': tempPhotoAlbumTitleText,
                    'tableEventTitleText': tempTableEventTitleText,
                    'tableDateText': tempTableDateText
                };

                // BLOCK CONTENT DATAs(TABLE-CONTENT)
                let tempEventId;
                let tempEventTitleText;
                let tempEventDateText;
                let tempEventDynamicPageUrl;
                let tempEventDataHolder;

                for (let i = 0; i < data.length; i++) {
                    tempEventId = data[i].id;
                    tempEventDateText = data[i].event_date;
    
                    switch (lang) {
                        case 'zh':
                            tempEventTitleText = data[i].title_in_chinese ? data[i].title_in_chinese : data[i].title_in_english;
                            break;
                        case 'ms':
                            tempEventTitleText = data[i].title_in_malay ? data[i].title_in_malay : data[i].title_in_english;
                            break;
                        case 'en':
                        default:
                            tempEventTitleText = data[i].title_in_english;
                            break;
                    }
    
                    tempEventDynamicPageUrl = '/media-gallery-photo-album/' + encodeURIComponent(tempEventTitleText) + '?v=' + btoa('cat=' + tempEventId + '&rec=' + tempEventId);

                    tempEventDataHolder = {
                        'eventId': tempEventId,
                        'eventTitleText': tempEventTitleText,
                        'eventDateText': tempEventDateText,
                        'eventDynamicPageUrl': tempEventDynamicPageUrl
                    }

                    allEventDataHolder.push(tempEventDataHolder);
                }
    
                // Generating the html elements of the block
                createMediaGalleryPhotoAlbumContent();
            }
        });
    }

    // Generating the html elements of the block
    function createMediaGalleryPhotoAlbumContent() {
        createMediaGalleryPhotoAlbumContentHeader();
        createMediaGalleryPhotoAlbumContentBodyTableWrapper();
    }

    // Creating html elements for the block header title etc
    function createMediaGalleryPhotoAlbumContentHeader() {
        const mediaGalleryPhotoAlbumHeaderContentRow = document.createElement('DIV');
        mediaGalleryPhotoAlbumHeaderContentRow.className = "row";
        const mediaGalleryPhotoAlbumHeaderContentCol = document.createElement('DIV');
        mediaGalleryPhotoAlbumHeaderContentCol.className = "col-12";

        const photoAlbumTitleHtml = document.createElement('P');
        photoAlbumTitleHtml.className = "photo-album-title";
        photoAlbumTitleHtml.innerHTML = headerDataHolder.photoAlbumTitleText;

        mediaGalleryPhotoAlbumHeaderContentCol.appendChild(photoAlbumTitleHtml);
        mediaGalleryPhotoAlbumHeaderContentRow.appendChild(mediaGalleryPhotoAlbumHeaderContentCol);
        mediaGalleryPhotoAlbumContent.appendChild(mediaGalleryPhotoAlbumHeaderContentRow);
    }

    // Creating html elements for the block TABLE header
    function createMediaGalleryPhotoAlbumContentBodyTableWrapper() {
        const mediaGalleryPhotoAlbumBodyContentRow = document.createElement('DIV');
        mediaGalleryPhotoAlbumBodyContentRow.className = "row";
        const mediaGalleryPhotoAlbumBodyContentCol = document.createElement('DIV');
        mediaGalleryPhotoAlbumBodyContentCol.className = "col-12";

        let tableHeadContentHtml = '<tr>' +
            '<th class="photo-album-table-head-sub-title">' + headerDataHolder.tableEventTitleText + '</th>' +
            '<th class="photo-album-table-head-sub-date">' + headerDataHolder.tableDateText + '</th>' +
            '</tr>';

        let tableHeadHtml = '<thead class="photo-album-table-head-main">' + tableHeadContentHtml + '</thead>';
        let tableBodyHtml = '<tbody class="photo-album-table-body-main"></tbody>';

        const tableHtml = document.createElement('TABLE');
        tableHtml.className = "table table-bordered photo-album-table";
        tableHtml.innerHTML = tableHeadHtml + tableBodyHtml;

        mediaGalleryPhotoAlbumBodyContentCol.appendChild(tableHtml);
        mediaGalleryPhotoAlbumBodyContentRow.appendChild(mediaGalleryPhotoAlbumBodyContentCol);
        mediaGalleryPhotoAlbumContent.appendChild(mediaGalleryPhotoAlbumBodyContentRow);

        createMediaGalleryPhotoAlbumContentBodyTableData();
    }

    // Creating html elements for the block TABLE contents
    function createMediaGalleryPhotoAlbumContentBodyTableData() {
        const tableBodyMainWrapper = $('.' + parentBlockUniqueIdentifier + ' .photo-album-table-body-main')[0];
        if (tableBodyMainWrapper) {
            tableBodyMainWrapper.innerHTML = "";
        }

        let tempTableBodyContentHtml;

        for (let i = 0; i < allEventDataHolder.length; i++) {
            tempTableBodyContentHtml = document.createElement('TR');
            tempTableBodyContentHtml.className = "photo-album-table-body-row";
            tempTableBodyContentHtml.innerHTML = '<td class="photo-album-table-data-sub-title"><a href="' + allEventDataHolder[i].eventDynamicPageUrl + '" class="photo-album-table-data-sub-title-link">' + allEventDataHolder[i].eventTitleText + '</a></td>' +
                '<td class="photo-album-table-data-sub-date">' + allEventDataHolder[i].eventDateText + '</td>';

            if (tableBodyMainWrapper) {
                tableBodyMainWrapper.appendChild(tempTableBodyContentHtml);
            }

            allEventDataHolderHtml.push(tempTableBodyContentHtml);
        }

        mediaSizeChecker();
    }

    // Create Pagination Html Elemetns and functions for the table
    function paginateMediaGalleryPhotoAlbumContentBodyTableData(events) {
        if ($('.' + parentBlockUniqueIdentifier + ' .pagination-row')) {
            $('.' + parentBlockUniqueIdentifier + ' .pagination-row').remove();
        }

        // Creating the pages row and col and wrappers
        const paginationContentRow = document.createElement('DIV');
        paginationContentRow.className = "row pagination-row";
        const paginationContentCol = document.createElement('DIV');
        paginationContentCol.className = "col-12";

         // Creating the pages row and col and wrappers
        const paginationWrapperHtml = document.createElement('DIV');
        paginationWrapperHtml.className = "pagination-wrapper";
        const pagesWrapperHtml = document.createElement('DIV');
        pagesWrapperHtml.className = "pages-wrapper";

        paginationContentCol.appendChild(paginationWrapperHtml);
        paginationContentRow.appendChild(paginationContentCol);
        mediaGalleryPhotoAlbumContent.appendChild(paginationContentRow);

        var totalData = events.length;
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
                    displaySelectedPageData(firstPage, events);     
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
                    displaySelectedPageData(previousPage, events);     
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
                    displaySelectedPageData(nextPage, events);     
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
                    displaySelectedPageData(lastPage, events);     
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
                        displaySelectedPageData($(this), events);
                    }
                });
                
                pagesWrapperHtml.appendChild(page);
            }

            displayCorrespodingPages((startPage - 1), numberPagesToShow);
            checkShortCutButtons($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), totalPages);
            displaySelectedPageData($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), events);
        }
    }

    function displayCorrespodingPages(startPage, endPage) {  
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.active-pages').removeClass("active-pages");
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page').slice(startPage, endPage).addClass("active-pages");
    }

    function displaySelectedPageData(selectedPage, events) {
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').removeClass('selected-page'); // Remove previous selected page
        $(selectedPage).addClass('selected-page'); // Make this current selected page

        var page = $(selectedPage).attr('data-value');
        var startItem = (page - 1) * numberDataToShowPerPage;
        var endItem = startItem + numberDataToShowPerPage;

        $('.' + parentBlockUniqueIdentifier + ' .photo-album-table-body-row.photo-album-table-body-row-selected').removeClass("photo-album-table-body-row-selected");
        $(events).slice(startItem, endItem).addClass("photo-album-table-body-row-selected");
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
        mobileNumberDataToShowPerPage = 10;
        tabletNumberDataToShowPerPage = 15;
        desktopNumberDataToShowPerPage = 20;

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

        paginateMediaGalleryPhotoAlbumContentBodyTableData(allEventDataHolderHtml);
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
    });
}
