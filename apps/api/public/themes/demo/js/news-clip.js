function newsClipMain(lang, parentBlockUniqueIdentifier) {
    let startPage = 1; // start page always first page
    let numberPagesToShow; // Number of pages to be show in the list
    let numberDataToShowPerPage; // Number of datas in the table to be show in a page
    let headerDataHolder; // Header datas
    let allNewsClipDataHolder = []; // All songs data
    let allNewsClipDataHolderHtml = []; // All songs data in html
    let availableYear = ["All"];
    let currentSelectedYear;
    const newsClipContent = document.querySelector('.' + parentBlockUniqueIdentifier + ' .block-overall-content-y-padding');

    fetch('/json/news_clip/index.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].filepath === 'news_clip.json') {
                    let jsonFileName = data[i].filepath;
                    generateNewsClipContent(jsonFileName);
                    break;
                }
            }
        }
    });

    function generateNewsClipContent(jsonFileName) {
        fetch('/json/news_clip/' + jsonFileName)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // BLOCK HEADER DATAs
                let tempNewsClipTitleText;
                let tempSearchByYearText;
                let tempTableNewsTitleText;
                let tempTableDateText;
      
                switch (lang) {
                    case 'zh':
                        tempNewsClipTitleText = "新闻剪辑";
                        tempSearchByYearText = "按年份查看";
                        tempTableNewsTitleText = "活动名称";
                        tempTableDateText = "日期";
                        break;
                    case 'ms':
                        tempNewsClipTitleText = "Klip Berita";
                        tempSearchByYearText = "Lihat Mengikut Tahun";
                        tempTableNewsTitleText = "Tajuk Peristiwa";
                        tempTableDateText = "Tarikh";
                        break;
                    case 'en':
                    default:
                        tempNewsClipTitleText = "News Clips";
                        tempSearchByYearText = "View By Year";
                        tempTableNewsTitleText = "News Title";
                        tempTableDateText = "Date";
                        break;
                }

                headerDataHolder = {
                    'newsClipTitleText': tempNewsClipTitleText,
                    'searchByYearText': tempSearchByYearText,
                    'tableNewsTitleText': tempTableNewsTitleText,
                    'tableDateText': tempTableDateText
                };

                // BLOCK CONTENT DATAs(TABLE-CONTENT)
                function formatNewsDateDate(stringDate){ // Format date
                    var day;
                    var month;
                    var year;

                    day = stringDate.getDate();
                    month = stringDate.toLocaleString('default', { month: 'long' });
                    year =  stringDate.getFullYear();

                    availableYearChecking(year);
                    
                    return day + ' ' + month + ' ' +  year;
                }
                
                function availableYearChecking(year) { // Push all the available year into the year list
                    if (!availableYear.includes(year)) {
                        availableYear.push(year);
                    } 
                }

                let tempNewsCategoryId;
                let tempNewsCategoryText;
                let tempNewsId;
                let tempNewsTitleText;
                let tempNewsDateObject;
                let tempNewsDateText;
                let tempNewsDynamicPageUrl;
                let tempNewsClipHolder;
                
                for (let i = 0; i < data.length; i++) {
                    tempNewsCategoryId = data[i].id;

                    switch (lang) {
                        case 'zh':
                            tempNewsCategoryText = data[i].title_in_chinese ? data[i].title_in_chinese : data[i].title_in_english;
                            break;
                        case 'ms':
                            tempNewsCategoryText = data[i].title_in_malay ? data[i].title_in_malay : data[i].title_in_english;
                            break;
                        case 'en':
                        default:
                            tempNewsCategoryText = data[i].title_in_english;
                            break;
                    }
                   
                    for (let j = 0; j < data[i].data.length; j++) {
                        tempNewsId = data[i].data[j].id;
                        tempNewsDateObject = new Date(data[i].data[j].news_date);
                        tempNewsDateText = formatNewsDateDate(tempNewsDateObject);
                        
                        switch (lang) {
                            case 'zh':
                                tempNewsTitleText = data[i].data[j].title_in_chinese ? data[i].data[j].title_in_chinese : data[i].data[j].title_in_english;
                                break;
                            case 'ms':
                                tempNewsTitleText = data[i].data[j].title_in_malay ? data[i].data[j].title_in_malay : data[i].data[j].title_in_english;
                                break;
                            case 'en':
                            default:
                                tempNewsTitleText = data[i].data[j].title_in_english;
                                break;
                        }

                        tempNewsDynamicPageUrl = '/news-clip/' + encodeURIComponent(tempNewsTitleText) + '?v=' + btoa('cat=' + tempNewsCategoryId + '&rec=' + tempNewsId);

                        tempNewsClipHolder = {
                            'newsCategoryId':  tempNewsCategoryId,
                            'newsCategoryText':  tempNewsCategoryText,
                            'newsId':  tempNewsId,
                            'newsTitleText':  tempNewsTitleText,
                            'newsDateObject':  tempNewsDateObject,
                            'newsDateText':  tempNewsDateText,
                            'newsDynamicPageUrl':  tempNewsDynamicPageUrl
                        };

                        allNewsClipDataHolder.push(tempNewsClipHolder);
                    }
                }

                allNewsClipDataHolder.sort(function(a, b){
                    return b.newsDateObject - a.newsDateObject;
                });

                // Generating the html elements of the block
                createNewsClipContent();
            }
        });
    }

    // Generating the html elements of the block
    function createNewsClipContent () {
        createNewsClipContentHeader();
        createNewsClipContentBodyTableWrapper();
    }

     // Creating html elements for the block header title, search dropdown, etc
    function createNewsClipContentHeader() {
        const newsClipHeaderContentRow = document.createElement('DIV');
        newsClipHeaderContentRow.className = "row";
        const newsClipHeaderContentCol = document.createElement('DIV');
        newsClipHeaderContentCol.className = "col-12";

        const newsClipTitleHtml = document.createElement('P');
        newsClipTitleHtml.className = "news-clip-title";
        newsClipTitleHtml.innerHTML = headerDataHolder.newsClipTitleText;

        const newsClipSearchByYearWrapperHtml = document.createElement('DIV');
        newsClipSearchByYearWrapperHtml.className = "news-clip-search-by-year-wrapper";

        const newsClipSearchByYearTextHtml = document.createElement('P');
        newsClipSearchByYearTextHtml.className = "news-clip-search-by-year";
        newsClipSearchByYearTextHtml.innerHTML = headerDataHolder.searchByYearText;

        const newsClipSearchByYearDropdownHtml = document.createElement('SELECT');
        newsClipSearchByYearDropdownHtml.className = "news-clip-search-by-year-drop-down";
        newsClipSearchByYearDropdownHtml.onchange = function(){searchNewsClipContentBodyTableData(newsClipSearchByYearDropdownHtml.value);};
    
        for (let i = 0; i < availableYear.length; i++) {
            const newsClipSearchByYearOption =  document.createElement('OPTION');
            newsClipSearchByYearOption.setAttribute("value", availableYear[i]);
            newsClipSearchByYearOption.innerHTML = availableYear[i];

            newsClipSearchByYearDropdownHtml.appendChild(newsClipSearchByYearOption);
        }

        newsClipSearchByYearWrapperHtml.appendChild(newsClipSearchByYearTextHtml);
        newsClipSearchByYearWrapperHtml.appendChild(newsClipSearchByYearDropdownHtml);

        newsClipHeaderContentCol.appendChild(newsClipTitleHtml);
        newsClipHeaderContentCol.appendChild(newsClipSearchByYearWrapperHtml);
        newsClipHeaderContentRow.appendChild(newsClipHeaderContentCol);
        newsClipContent.appendChild(newsClipHeaderContentRow);
    }

    // Creating html elements for the block TABLE header
    function createNewsClipContentBodyTableWrapper() {
        const newsClipBodyContentRow = document.createElement('DIV');
        newsClipBodyContentRow.className = "row";
        const newsClipBodyContentCol = document.createElement('DIV');
        newsClipBodyContentCol.className = "col-12";

        let tableHeadContentHtml = '<tr>' +
            '<th class="news-clip-table-head-sub-title">' + headerDataHolder.tableNewsTitleText + '</th>' +
            '<th class="news-clip-table-head-sub-date">' + headerDataHolder.tableDateText + '</th>' +
            '</tr>';

        let tableHeadHtml = '<thead class="news-clip-table-head-main">' + tableHeadContentHtml + '</thead>';
        let tableBodyHtml = '<tbody class="news-clip-table-body-main"></tbody>';

        const tableHtml = document.createElement('TABLE');
        tableHtml.className = "table table-bordered news-clip-table";
        tableHtml.innerHTML = tableHeadHtml + tableBodyHtml;

        newsClipBodyContentCol.appendChild(tableHtml);
        newsClipBodyContentRow.appendChild(newsClipBodyContentCol);
        newsClipContent.appendChild(newsClipBodyContentRow);

        createNewsClipContentBodyTableData();
    }

    function createNewsClipContentBodyTableData() {
        const tableBodyMainWrapper = $('.' + parentBlockUniqueIdentifier + ' .news-clip-table-body-main')[0];
        if (tableBodyMainWrapper) {
            tableBodyMainWrapper.innerHTML = "";
        }

        let tempTableBodyContentHtml;
    
        for (i = 0; i < allNewsClipDataHolder.length; i++) {
            tempTableBodyContentHtml = document.createElement('TR');
            tempTableBodyContentHtml.className = "news-clip-table-body-row";
            tempTableBodyContentHtml.setAttribute("data-value", allNewsClipDataHolder[i].newsDateObject.getFullYear().toString());
            tempTableBodyContentHtml.innerHTML = '<td class="news-clip-table-data-sub-title"><a href="' + allNewsClipDataHolder[i].newsDynamicPageUrl + '" class="news-clip-table-data-sub-title-link">' + allNewsClipDataHolder[i].newsCategoryText + " - " + allNewsClipDataHolder[i].newsTitleText + '</a></td>' +
                '<td class="news-clip-table-data-sub-date">' + allNewsClipDataHolder[i].newsDateText + '</td>';
        
            if (tableBodyMainWrapper) {
                tableBodyMainWrapper.appendChild(tempTableBodyContentHtml);
            }

            allNewsClipDataHolderHtml.push(tempTableBodyContentHtml);
        }

        mediaSizeChecker();
    }

    // Search by year Function
    function searchNewsClipContentBodyTableData(searchValue) {
        if (searchValue != currentSelectedYear) {
            currentSelectedYear = searchValue;
         
            if (searchValue === 'All') {
                paginateMediaGalleryPhotoAlbumContentBodyTableData(allNewsClipDataHolderHtml);

            } else {
                var selectedYearNewsClip = allNewsClipDataHolderHtml.filter(function(newsClip) {
                    return newsClip.getAttribute("data-value") == searchValue;
                });

                paginateMediaGalleryPhotoAlbumContentBodyTableData(selectedYearNewsClip);
            }
        }
    }

    // Create Pagination Html Elemetns and functions for the table
    function paginateMediaGalleryPhotoAlbumContentBodyTableData(newsClips) {
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
        newsClipContent.appendChild(paginationContentRow);

        var totalData = newsClips.length;
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
                    displaySelectedPageData(firstPage, newsClips);     
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
                    displaySelectedPageData(previousPage, newsClips);     
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
                    displaySelectedPageData(nextPage, newsClips);     
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
                    displaySelectedPageData(lastPage, newsClips);     
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
                        displaySelectedPageData($(this), newsClips);
                    }
                });
                
                pagesWrapperHtml.appendChild(page);
            }

            displayCorrespodingPages((startPage - 1), numberPagesToShow);
            checkShortCutButtons($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), totalPages);
            displaySelectedPageData($('.' + parentBlockUniqueIdentifier + ' .pagination-page:first'), newsClips);
        }
    }

    function displayCorrespodingPages(startPage, endPage) {  
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.active-pages').removeClass("active-pages");
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page').slice(startPage, endPage).addClass("active-pages");
    }

    function displaySelectedPageData(selectedPage, newsClips) {
        $('.' + parentBlockUniqueIdentifier + ' .pagination-page.selected-page').removeClass('selected-page'); // Remove previous selected page
        $(selectedPage).addClass('selected-page'); // Make this current selected page
        var page = $(selectedPage).attr('data-value');
        var startItem = (page - 1) * numberDataToShowPerPage;
        var endItem = startItem + numberDataToShowPerPage;

        $('.' + parentBlockUniqueIdentifier + ' .news-clip-table-body-row.news-clip-table-body-row-selected').removeClass("news-clip-table-body-row-selected");
        $(newsClips).slice(startItem, endItem).addClass("news-clip-table-body-row-selected");
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

        // Reset dropdown to first(default) option
        $('.' + parentBlockUniqueIdentifier + ' .news-clip-search-by-year-drop-down').prop('selectedIndex', 0);

        // Re-paginate
        paginateMediaGalleryPhotoAlbumContentBodyTableData(allNewsClipDataHolderHtml);
    }

    window.addEventListener('resize', function () {
        mediaSizeChecker();
    });
}
