let years;
fetch('/json/financial_statements/statements.json')
        .then(response => response.json())
        .then(data => {
            years = data;

            const dropdownOptionElement = document.querySelector('.block-affin-group-financial-information #statementYear');
            if (dropdownOptionElement) {
                dropdownOptionElement.innerHTML = '';
            }

            for (const [index, year] of years.entries()) {
                const financialStatementYearElement = document.createElement('option');
                financialStatementYearElement.setAttribute('value', year.year);
                financialStatementYearElement.innerText = year.year;

                if (index === years.length - 1) {
                    financialStatementYearElement.setAttribute('selected', true);
                }

                dropdownOptionElement.appendChild(financialStatementYearElement);
            }
        });

const searchFilter = document.querySelector('.block-affin-group-financial-information .statement-search-btn');
if (searchFilter) {
    searchFilter.addEventListener('click', function () {
        loadListingStatement(document.getElementById('statementYear').value);
    });
}

const reportSearchFilter = document.querySelector('.block-affin-group-financial-information .annual-search-btn');
if (reportSearchFilter) {
    reportSearchFilter.addEventListener('click', function () {
        loadAnnualReport(document.getElementById('annualReportYear').value);
    });
}

function switchAffinGroup3Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let tab of tabs) {
        if (!tabsChecker.includes(tab.className)) {
            tab.style.display = 'none';
            tabsChecker.push(tab.className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = 'block';
    }

    const headerTabs = document.querySelectorAll(`.${parentClassName} .tab-title`);
    if (headerTabs) {
        for (let tab of headerTabs) {
            tab.classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .tab-title.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab3FirstTab() {
    const allTabs = document.querySelectorAll('.block-affin-group-financial-information .tab');

    for (let tab of allTabs) {
        if (!tab.classList.contains('tab-1')) {
            tab.style.display = 'none';
        }
    }
}

function loadListingStatement(selectedYear) {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            language = lang

            const statements = $('.block-affin-group-financial-information .listingStatements')[0];

            if (statements) {
                statements.innerHTML = '';
            }

            for (let year of years) {
                const financialStatements = year.statements;

                if (selectedYear === year.year) {
                    for (let statement of financialStatements) {
                        let date;
                        let url;
                        let downloadText;
                        const img = 'https://admin.affinalways.com/img/financial-1.png';

                        switch (language) {
                            case 'ms':
                                date = statement.date_in_malay ?? statement.date_in_english;
                                url = statement.url_in_malay ?? statement.url_in_english;
                                downloadText = 'Muat Turun';
                                break;
                            case 'en':
                            default:
                                date = statement.date_in_english;
                                url = statement.url_in_english;
                                downloadText = 'Download';
                                break;
                        }

                        const statementsElement = document.createElement('div');

                        statementsElement.innerHTML = `<div class="card">
                            <img class="banner-image" src="${img}" alt="banner-image">
                            <div class="card-text">${date}</div>
                            <a class="card-download-text" href="${url}">${downloadText}</a>`;

                        if (statements) {
                            statements.appendChild(statementsElement);
                        }
                    }
                }
            }
        });
}

function loadAnnualReport(selectedYear) {
    let annualReportYears = [
        {
            "year": "2012",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2012-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2012-AIBB-AR-publication.pdf"
        },
        {
            "year": "2013",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2013-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2013-AIBB-AR-publication.pdf"
        },
        {
            "year": "2014",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2014-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2014-AIBB-AR-publication.pdf"
        },
        {
            "year": "2015",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2015-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2015-AIBB-AR-publication.pdf"
        },
        {
            "year": "2016",
            "date_in_english": "31 December",
            "date_in_malay": "31 Disember",
            "img_in_english": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "img_in_malay": "https://admin.affinalways.com/img/cover-annual-report.jfif",
            "annualReportUrl_in_english": "/storage/financial-Information/Annual%20Reports/2016-AIBB-AR-publication.pdf",
            "annualReportUrl_in_malay": "/storage/financial-Information/Annual%20Reports/2016-AIBB-AR-publication.pdf"
        }
    ];


    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            const reports = $('.block-affin-group-financial-information .listingAnnualReports')[0];

            if (reports) {
                reports.innerHTML = '';
            }

            for (let year of annualReportYears) {
                let img;
                let date;
                let annualReportUrl;
                let downloadText;

                switch (lang) {
                    case 'ms':
                        img = year.img_in_malay ?? year.img_in_english;
                        date = year.date_in_malay ?? year.date_in_english;
                        annualReportUrl = year.annualReportUrl_in_malay ?? year.annualReportUrl_in_english;
                        downloadText = 'Muat Turun';
                        break;
                    case 'en':
                    default:
                        img = year.img_in_english;
                        date = year.date_in_english;
                        annualReportUrl = year.annualReportUrl_in_english;
                        downloadText = 'Download';
                        break;
                }

                if (selectedYear === year.year) {

                    const statementsElement = document.createElement('div');

                    statementsElement.innerHTML = `<div class="annual-card">
                        <img src="${img}" alt="banner-image">'
                        <div class="card-text">${date}</div>
                        <a class="card-download-text" href="${annualReportUrl}">${downloadText}</a>`;

                    if (reports) {
                        reports.appendChild(statementsElement);
                    }
                }
            }
        });

}

ready(function () {
    if (document.querySelector('.block-affin-group-financial-information')) {
        switchTab3FirstTab();
        if (years) {
            loadListingStatement(years.slice(-1)[0].year);
        }
        loadAnnualReport('2016');
        fetch('/currentLang')
            .then(response => response.text())
            .then(lang => {

                let yearText;
                let searchText;

                switch (lang) {
                    case 'ms':
                        yearText = 'Tahun';
                        searchText = 'Cari';
                        break;
                    case 'en':
                    default:
                        yearText = 'Year';
                        searchText = 'Search';
                        break;
                }

                document.querySelector('.block-affin-group-financial-information .year-filter-text').innerHTML = yearText;
                document.querySelector('.block-affin-group-financial-information .statement-search-text').innerHTML = searchText;
                document.querySelector('.block-affin-group-financial-information .annual-year-text').innerHTML = yearText;
                document.querySelector('.block-affin-group-financial-information .annual-search-text').innerHTML = searchText;
            });
    }
});
