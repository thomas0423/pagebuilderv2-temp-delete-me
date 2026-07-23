function initCareerBlock() {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            appendSpecializationElements(lang);
            appendLocationElements(lang);
            getCareerElements(lang);
            initLoadMoreCareerButton(lang);
            if (lang === 'ms') {
                const searchTitleInputElement = document.querySelector('.block-affin-group-career #position-title');
                if (searchTitleInputElement) {
                    searchTitleInputElement.setAttribute('placeholder', 'Gelaran jawatan...');
                }

                const hiringTextElement = document.querySelector('.block-affin-group-career .hiring-text');
                if (hiringTextElement) {
                    hiringTextElement.innerHTML = 'Kami sedang mengupah!';
                }
            }
        });
}

function appendSpecializationElements(lang) {
    fetch('/json/affin_group_career/specializations.json')
        .then(response => response.json())
        .then(specializations => {
            for (let specialization of specializations) {
                let name;
                switch (lang) {
                    case 'zh':
                        name = specialization.name_in_chinese ? specialization.name_in_chinese : specialization.name_in_english;
                        break;
                    case 'ms':
                        name = specialization.name_in_malay ? specialization.name_in_malay : specialization.name_in_english;
                        const defaultSpecializationOption = document.querySelector('.block-affin-group-career #default-specialization');
                        if (defaultSpecializationOption) {
                            defaultSpecializationOption.innerHTML = 'Pengkhususan';
                        }
                        break;
                    case 'en':
                    default:
                        name = specialization.name_in_english;
                        break;
                }
                const specializationDropdownOptionElement = document.createElement('OPTION');
                specializationDropdownOptionElement.value = specialization.id;
                specializationDropdownOptionElement.innerHTML = name;
                const specializationDropdownElement = document.querySelector('.block-affin-group-career .career-specialization-dropdown');
                if (specializationDropdownElement) {
                    specializationDropdownElement.appendChild(specializationDropdownOptionElement);
                }
            }
        });
}

function appendLocationElements(lang) {
    fetch('/json/affin_group_career/locations.json')
        .then(response => response.json())
        .then(locations => {
            for (let location of locations) {
                let locationName;
                switch (lang) {
                    case 'zh':
                        locationName = location.location_in_chinese ? location.location_in_chinese : location.location_in_english;
                        break;
                    case 'ms':
                        locationName = location.location_in_malay ? location.location_in_malay : location.location_in_english;
                        const defaultLocationOption = document.querySelector('.block-affin-group-career #default-location');
                        if (defaultLocationOption) {
                            defaultLocationOption.innerHTML = 'Lokasi';
                        }
                        break;
                    case 'en':
                    default:
                        locationName = location.location_in_english;
                        break;
                }
                const locationDropdownOptionElement = document.createElement('OPTION');
                locationDropdownOptionElement.value = location.id;
                locationDropdownOptionElement.innerHTML = locationName;
                const locationDropdownElement = document.querySelector('.block-affin-group-career .career-location-dropdown');
                if (locationDropdownElement) {
                    locationDropdownElement.appendChild(locationDropdownOptionElement);
                }
            }
        });
}

function getCareerElements(lang) {
    fetch('/json/affin_group_career/careers.json')
        .then(response => response.json())
        .then(careers => {
            careers.sort(function (a, b) {
                return a.order - b.order;
            });
            appendCareerElements(lang, careers, true);
        });
}

function appendCareerElements(lang, careers, isInitSearchButtonRequired) {
    for (let career of careers) {
        let title;
        let division;
        let specialization;
        let location;
        let careerLink;
        switch (lang) {
            case 'zh':
                title = career.title_in_chinese ? career.title_in_chinese : career.title_in_english;
                division = career.division_in_chinese ? career.division_in_chinese : career.division_in_english;
                specialization = career.specialization_in_chinese ? career.specialization_in_chinese : career.specialization_in_english;
                location = career.location_in_chinese ? career.location_in_chinese : career.location_in_english;
                break;
            case 'ms':
                title = career.title_in_malay ? career.title_in_malay : career.title_in_english;
                division = career.division_in_malay ? career.division_in_malay : career.division_in_english;
                specialization = career.specialization_in_malay ? career.specialization_in_malay : career.specialization_in_english;
                location = career.location_in_malay ? career.location_in_malay : career.location_in_english;
                careerLink = '/bm/affin-group-career?v=' + btoa('careerId=' + career.id);
                break;
            case 'en':
            default:
                title = career.title_in_english;
                division = career.division_in_english;
                specialization = career.specialization_in_english;
                location = career.location_in_english;
                careerLink = '/affin-group-career?v=' + btoa('careerId=' + career.id);
                break;
        }
        const careerListElement = document.createElement('DIV');
        careerListElement.innerHTML = '<div class="col-12 col-md-3">' +
            '<a href="' + careerLink + '" class="career-list-title-link" target="_blank">' +
            '<p class="career-list-title">' + title + '</p>' +
            '</a>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-division-text">' + division + '</p>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-specialization-text">' + specialization + '</p>' +
            '</div>' +
            '<div class="col-12 col-md-3">' +
            '<p class="career-list-location-list">' + location + '</p>' +
            '</div>';
        careerListElement.classList.add('row', 'career-list', 'hide-career-list');
        const careerListContainer = document.querySelector('.block-affin-group-career .career-list-container');
        if (careerListContainer) {
            careerListContainer.appendChild(careerListElement);
        }
    }
    const $hiddenCareerList = $(".hide-career-list:hidden");
    $hiddenCareerList.slice(0, 10).removeClass('hide-career-list');
    if (isInitSearchButtonRequired === true) {
        initSearchButton(lang, careers);
    }
}

function initSearchButton(lang, careers) {
    let filteredCareerArray;
    const searchButton = document.querySelector('.block-affin-group-career #career-search-button');
    if (searchButton) {
        if (lang === 'ms') {
            searchButton.innerHTML = 'Cari';
        }
        searchButton.addEventListener('click', function () {
            filteredCareerArray = [];
            const careerListContainer = document.querySelector('.block-affin-group-career .career-list-container');
            if (careerListContainer) {
                careerListContainer.innerHTML = '';
            }
            const careerTitleInput = document.querySelector('.block-affin-group-career #position-title');
            if (careerTitleInput) {
                const careerTitleInputValue = careerTitleInput.value;
                for (let career of careers) {
                    let title;
                    switch (lang) {
                        case 'zh':
                            title = career.title_in_chinese ? career.title_in_chinese : career.title_in_english;
                            break;
                        case 'ms':
                            title = career.title_in_malay ? career.title_in_malay : career.title_in_english;
                            break;
                        case 'en':
                        default:
                            title = career.title_in_english;
                            break;
                    }
                    if (careerTitleInputValue !== null && careerTitleInputValue !== '' && careerTitleInputValue !== ' ') {
                        const regex = new RegExp(careerTitleInputValue, 'gi');
                        const isTitleMatch = regex.test(title);
                        if (isTitleMatch) {
                            filteredCareerArray.push(career);
                        }
                    } else {
                        filteredCareerArray.push(career);
                    }
                }
            }
            const careerSpecializationInput = document.querySelector('.block-affin-group-career #career-specialization');
            if (careerSpecializationInput) {
                const careerSpecializationInputValue = careerSpecializationInput.value;
                if (careerSpecializationInputValue !== null && careerSpecializationInputValue !== '') {
                    filteredCareerArray = filteredCareerArray.filter(career => career.specialization_id === parseInt(careerSpecializationInputValue));
                }
            }
            const careerLocationInput = document.querySelector('.block-affin-group-career #career-location');
            if (careerLocationInput) {
                const careerLocationInputValue = careerLocationInput.value;
                if (careerLocationInputValue !== null && careerLocationInputValue !== '') {
                    filteredCareerArray = filteredCareerArray.filter(career => career.location_id === parseInt(careerLocationInputValue));
                }
            }
            const noResultTextElement = document.querySelector('.block-affin-group-career .no-result-text');
            const loadMoreCareerButton = document.querySelector('.block-affin-group-career .load-more-career-btn');
            if (noResultTextElement && loadMoreCareerButton) {
                if (lang === 'ms') {
                    noResultTextElement.innerHTML = 'Tiada Keputusan...';
                }

                if (filteredCareerArray.length === 0) {
                    noResultTextElement.style.display = 'block';
                    loadMoreCareerButton.style.display = 'none';
                } else {
                    noResultTextElement.style.display = 'none';
                    loadMoreCareerButton.style.display = 'inline-block';
                }
            }
            appendCareerElements(lang, filteredCareerArray, false);
        })
    }
}

function initLoadMoreCareerButton(lang) {
    const loadMoreCareerButton = document.querySelector('.block-affin-group-career .load-more-career-btn');
    if (loadMoreCareerButton) {
        if (lang === 'ms') {
            loadMoreCareerButton.innerHTML = 'Tambah lagi';
        }
        loadMoreCareerButton.addEventListener('click', function () {
            const $hiddenCareerList = $(".hide-career-list:hidden");
            $hiddenCareerList.slice(0, 5).removeClass('hide-career-list');
            if ($hiddenCareerList.length === 0) {
                loadMoreCareerButton.style.display = 'none';
            }
        })
    }
}
