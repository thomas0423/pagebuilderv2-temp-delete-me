function mediaGallerySongMain(lang, parentBlockUniqueIdentifier) {
    let startPage = 1; // start page always first page
    let numberPagesToShow; // Number of pages to be show in the list
    let numberDataToShowPerPage; // Number of datas in the table to be show in a page
    let headerDataHolder; // Header datas
    let allSongDataHolder = []; // All songs data
    let allSongDataHolderHtml = []; // All songs data in html
    const mediaGallerySongContent = document.querySelector('.' + parentBlockUniqueIdentifier + ' .block-overall-content-y-padding');

    fetch('/json/media-gallery-song/index.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].filepath === 'media_gallery_song.json') {
                    let jsonFileName = data[i].filepath;
                    generateMediaGallerySongContent(jsonFileName);
                    break;
                }
            }
        }
    });

    function generateMediaGallerySongContent(jsonFileName) {
        fetch('/json/media-gallery-song/' + jsonFileName)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // BLOCK HEADER DATAs
                let tempSongTitleText;
                let tempTableSongTitleText;

                switch (lang) {
                    case 'zh':
                        tempSongTitleText = "音乐";
                        tempTableSongTitleText = "音乐名称";
                        break;
                    case 'ms':
                        tempSongTitleText = "Lagu";
                        tempTableSongTitleText = "Tajuk Lagu";
                        break;
                    case 'en':
                    default:
                        tempSongTitleText = "Songs";
                        tempTableSongTitleText = "Song Title";
                        break;
                }

                headerDataHolder = {
                    'songTitleText': tempSongTitleText,
                    'tableSongTitleText': tempTableSongTitleText
                };

                // BLOCK CONTENT DATAs(TABLE-CONTENT)
                let tempSongCategoryId;
                let tempSongCategory;
                let tempSongId;
                let tempSongName;
                let tempEventDynamicPageUrl;
                let tempSongDataHolder;

                for (let i = 0; i < data.length; i++) {
                    tempSongCategoryId = data[i].id;

                    switch (lang) {
                        case 'zh':
                            tempSongCategory = data[i].title_in_chinese ? data[i].title_in_chinese : data[i].title_in_english;
                            break;
                        case 'ms':
                            tempSongCategory = data[i].title_in_malay ? data[i].title_in_malay : data[i].title_in_english;
                            break;
                        case 'en':
                        default:
                            tempSongCategory = data[i].title_in_english;
                            break;
                    }

                    for (let j = 0; j < data[i].data.length; j++) {
                        tempSongId = data[i].data[j].id;

                        switch (lang) {
                            case 'zh':
                                tempSongName = data[i].data[j].title_in_chinese ? data[i].data[j].title_in_chinese : data[i].data[j].title_in_english;
                                break;
                            case 'ms':
                                tempSongName = data[i].data[j].title_in_malay ? data[i].data[j].title_in_malay : data[i].data[j].title_in_english;
                                break;
                            case 'en':
                            default:
                                tempSongName = data[i].data[j].title_in_english;
                                break;
                        }

                        tempEventDynamicPageUrl = '/media-gallery-song/' + encodeURIComponent(tempSongCategory) + '?v=' + btoa('cat=' + tempSongCategoryId + '&rec=' + tempSongId);

                        tempSongDataHolder = {
                            'songCategoryId': tempSongCategoryId,
                            'songCategory': tempSongCategory,
                            'songId': tempSongId,
                            'songName': tempSongName,
                            'eventDynamicPageUrl': tempEventDynamicPageUrl
                        }

                        allSongDataHolder.push(tempSongDataHolder);
                    }
                }

                // Generating the html elements of the block
                createMediaGallerySongContent();
            }
        });
    }

    // Generating the html elements of the block
    function createMediaGallerySongContent() {
        createMediaGallerySongContentHeader();
        createMediaGallerySongContentBodyTableWrapper();
    }

    // Creating html elements for the block header title etc
    function createMediaGallerySongContentHeader() {
        const mediaGallerySongHeaderContentRow = document.createElement('DIV');
        mediaGallerySongHeaderContentRow.className = "row";
        const mediaGallerySongHeaderContentCol = document.createElement('DIV');
        mediaGallerySongHeaderContentCol.className = "col-12";

        const songTitleHtml = document.createElement('P');
        songTitleHtml.className = "song-title";
        songTitleHtml.innerHTML = headerDataHolder.songTitleText;

        mediaGallerySongHeaderContentCol.appendChild(songTitleHtml);
        mediaGallerySongHeaderContentRow.appendChild(mediaGallerySongHeaderContentCol);
        mediaGallerySongContent.appendChild(mediaGallerySongHeaderContentRow);
    }

    // Creating html elements for the block TABLE header
    function createMediaGallerySongContentBodyTableWrapper() {
        const mediaGallerySongBodyContentRow = document.createElement('DIV');
        mediaGallerySongBodyContentRow.className = "row";
        const mediaGallerySongBodyContentCol = document.createElement('DIV');
        mediaGallerySongBodyContentCol.className = "col-12";

        let tableHeadContentHtml = '<tr>' +
            '<th class="song-table-head-sub-title">' + headerDataHolder.tableSongTitleText + '</th>' +
            '</tr>';

        let tableHeadHtml = '<thead class="song-table-head-main">' + tableHeadContentHtml + '</thead>';
        let tableBodyHtml = '<tbody class="song-table-body-main"></tbody>';

        const tableHtml = document.createElement('TABLE');
        tableHtml.className = "table table-bordered song-table";
        tableHtml.innerHTML = tableHeadHtml + tableBodyHtml;

        mediaGallerySongBodyContentCol.appendChild(tableHtml);
        mediaGallerySongBodyContentRow.appendChild(mediaGallerySongBodyContentCol);
        mediaGallerySongContent.appendChild(mediaGallerySongBodyContentRow);

        createMediaGallerySongContentBodyTableData();
    }

    // Creating html elements for the block TABLE contents
    function createMediaGallerySongContentBodyTableData() {
        const tableBodyMainWrapper = $('.' + parentBlockUniqueIdentifier + ' .song-table-body-main')[0];
        if (tableBodyMainWrapper) {
            tableBodyMainWrapper.innerHTML = "";
        }

        let tempTableBodyContentHtml;

        for (let i = 0; i < allSongDataHolder.length; i++) {
            tempTableBodyContentHtml = document.createElement('TR');
            tempTableBodyContentHtml.className = "song-table-body-row";
            tempTableBodyContentHtml.innerHTML = '<td class="song-table-data-sub-title"><a href="' + allSongDataHolder[i].eventDynamicPageUrl + '" class="song-table-data-sub-title-link">' + allSongDataHolder[i].songCategory + " - " + allSongDataHolder[i].songName + '</a></td>';

            if (tableBodyMainWrapper) {
                tableBodyMainWrapper.appendChild(tempTableBodyContentHtml);
            }

            allSongDataHolderHtml.push(tempTableBodyContentHtml);
        }

        mediaSizeChecker();
    }

    // Create Pagination Html Elemetns and functions for the table
    function paginateMediaGallerySongContentBodyTableData(songs) {
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
        mediaGallerySongContent.appendChild(paginationContentRow);

        var totalData = songs.length;
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
                    displaySelectedPageData(firstPage, songs);
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
                    displaySelectedPageData(previousPage, songs);
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
                    displaySelectedPageData(nextPage, songs);
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
                    displaySelectedPageData(lastPage, songs);
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
                        displaySelectedPageData($(this), songs);
                    }
                });

                pagesWrapperHtml.appendChild(page);
            }

            displayCorrespodingPages((startPage - 1), numberPagesToShow);
            checkShortCutButtons($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), totalPages);
            displaySelectedPageData($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), songs);
        }
    }

    function displayCorrespodingPages(startPage, endPage) {
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.active-pages').removeClass("active-pages");
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page').slice(startPage, endPage).addClass("active-pages");
    }

    function displaySelectedPageData(selectedPage, songs) {
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').removeClass('selected-page'); // Remove previous selected page
        $(selectedPage).addClass('selected-page'); // Make this current selected page

        var page = $(selectedPage).attr('data-value');
        var startItem = (page - 1) * numberDataToShowPerPage;
        var endItem = startItem + numberDataToShowPerPage;

        $('.' + parentBlockUniqueIdentifier + ' .song-table-body-row.song-table-body-row-selected').removeClass("song-table-body-row-selected");
        $(songs).slice(startItem, endItem).addClass("song-table-body-row-selected");
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

        paginateMediaGallerySongContentBodyTableData(allSongDataHolderHtml);
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
    });
}
