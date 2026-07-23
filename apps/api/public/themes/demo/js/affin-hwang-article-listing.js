let irlCurrentCategoryId = null;

function initAffinHwangArticleListing(lang) {
    fetch('/json/affin-hwang-articles/index.json')
        .then(response => response.json())
        .then(data => {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            const isInApp = url.searchParams.get('inApp') === 'true';
            if (isInApp) {
                const articleListingBlockElement = document.querySelector('.irlBlockAffinHwangArticleListing');
                if (articleListingBlockElement) {
                    articleListingBlockElement.style.padding = '0';
                }

                const articleListingBlockContainerElement = document.querySelector('.irlBlockAffinHwangArticleListing .container');
                if (articleListingBlockContainerElement) {
                    articleListingBlockContainerElement.classList.remove('py-5');
                }
            }
            initTags(lang, data).then(function () {
                initCategoryDropdown(lang, data);
                initMobileFilterModal(lang, data);
                initMobileSearch(lang, data);
                initMostViewArticles(lang);
                initMostLikedArticles(lang);
            });
        });
}

function initArticleListing(lang, data, selectedCategoryId) {
    const articlesByTag = {};

    const selectedCategory = data.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) return;

    irlCurrentCategoryId = selectedCategoryId;

    const allSections = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlFilteredArticlesSection');
    allSections.forEach(section => section.style.display = 'none');

    (selectedCategory.articles || []).forEach(article => {
        (article.tags || []).forEach(tag => {
            const tagId = tag.id ?? tag;
            if (!articlesByTag[tagId]) {
                articlesByTag[tagId] = [];
            }
            articlesByTag[tagId].push(article);
        });
    });

    Object.keys(articlesByTag).forEach(tagId => {
        const container = document.querySelector(`.irlBlockAffinHwangArticleListing .irlArticleListTagId${tagId}`);
        const loadMoreButton = document.querySelector(`.irlBlockAffinHwangArticleListing .irlLoadMoreButtonTagId${tagId}`);
        if (!container || !loadMoreButton) return;

        container.innerHTML = '';

        let currentIndex = 0;
        const pageSize = 5;

        let loadMoreText;
        switch (lang) {
            case 'zh':
                loadMoreText = '查看更多';
                break;
            case 'ms':
                loadMoreText = 'Lebih Lanjut';
                break;
            default:
                loadMoreText = 'Load More';
                break;
        }
        loadMoreButton.textContent = loadMoreText;

        function renderNextArticles() {
            const nextArticles = articlesByTag[tagId].slice(currentIndex, currentIndex + pageSize);
            renderArticleListingByTag(lang, nextArticles, container);
            currentIndex += nextArticles.length;

            if (currentIndex >= articlesByTag[tagId].length) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }

        loadMoreButton.onclick = function () {
            renderNextArticles();
        };

        renderNextArticles();

        const section = container.parentElement;
        if (section) section.style.display = 'block';
    });

    const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
    tagButtons.forEach(btn => {
        const tagId = btn.getAttribute('data-tag-id');
        const section = document.querySelector(`.irlBlockAffinHwangArticleListing .irlFilteredArticlesSection .irlArticleListTagId${tagId}`);
        if (!section) return;

        if (btn.classList.contains('active') && articlesByTag[tagId]) {
            section.parentElement.style.display = 'block';
        } else {
            section.parentElement.style.display = 'none';
        }
    });
}

function renderArticleListingByTag(lang, articles, container) {
    const params = new URLSearchParams(window.location.search);
    const isInApp = params.get('inApp') === 'true';

    if (isInApp) {
        // TODO: hide header
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.style.display = 'none';
        }
    }

    articles.forEach(article => {
        let title, description, cover, readMoreText, articleDetailUrl;

        articleDetailUrl = `/${lang}/learn/details?v=${btoa(`articleId=${article.id}`)}`;
        articleDetailUrl = articleDetailUrl.replaceAll('%20', '-');

        if (isInApp) {
            articleDetailUrl += '&inApp=true';
        }

        switch (lang) {
            case 'zh':
                title = article.title_in_chinese ?? article.title_in_english;
                description = article.description_in_chinese ?? article.description_in_english;
                cover = article.cover_image_in_chinese ?? article.cover_image_in_english;
                readMoreText = '查看更多';
                break;
            case 'ms':
                title = article.title_in_malay ?? article.title_in_english;
                description = article.description_in_malay ?? article.description_in_english;
                cover = article.cover_image_in_malay ?? article.cover_image_in_english;
                readMoreText = 'Lebih Lanjut';
                break;
            default:
                title = article.title_in_english;
                description = article.description_in_english;
                cover = article.cover_image_in_english;
                readMoreText = 'Read More';
                break;
        }

        const articleElement = document.createElement('DIV');
        articleElement.className = 'irlArticleCard d-flex flex-column flex-md-row mb-4';
        articleElement.innerHTML = `
            <div class="irlArticleMain d-flex">
                <div class="irlArticleImageWrapper">
                <img src="${cover}" alt="${title}" class="img-fluid irlArticleImage">
                </div>

                <div class="irlArticleContent d-flex flex-column">
                <h3 class="irlArticleTitle">${title}</h3>
                <p class="irlArticleMeta">
                    <b class="text-dark">${article.author}</b>
                    <span class="d-none d-md-inline"> - </span>
                    <br class="d-block d-md-none">
                    <span>${article.date}</span>
                </p>
                <p class="irlArticleExcerpt d-none d-md-block">${description}</p>
                </div>
            </div>

            <div class="irlButtonWrapper">
                <a href="${articleDetailUrl}" class="irlReadMoreButton">
                ${readMoreText}
                </a>
            </div>
        `;
        container.appendChild(articleElement);
    });
}

function initCategoryDropdown(lang, data) {
    const affinHwangArticleListingContainer = document.querySelector('.irlBlockAffinHwangArticleListing');
    if (!affinHwangArticleListingContainer) return;

    const firstCategoryWithArticles = data.find(cat => cat.articles && cat.articles.length > 0);
    const selectedCategoryId = firstCategoryWithArticles ? firstCategoryWithArticles.id : null;

    const irlDefaultCategoryElement = affinHwangArticleListingContainer.querySelector('.irlDefaultCategory');
    if (irlDefaultCategoryElement && firstCategoryWithArticles) {
        let categoryName;
        switch (lang) {
            case 'zh':
                categoryName = firstCategoryWithArticles.name_in_chinese ?? firstCategoryWithArticles.name_in_english;
                break;
            case 'ms':
                categoryName = firstCategoryWithArticles.name_in_malay ?? firstCategoryWithArticles.name_in_english;
                break;
            default:
                categoryName = firstCategoryWithArticles.name_in_english;
                break;
        }
        irlDefaultCategoryElement.innerHTML = categoryName;
    }

    const irlLevelDropdownMenuElement = affinHwangArticleListingContainer.querySelector('.irlLevelDropdownMenu');
    if (irlLevelDropdownMenuElement) {
        data.forEach(category => {
            let categoryName;
            switch (lang) {
                case 'zh':
                    categoryName = category.name_in_chinese ?? category.name_in_english;
                    break;
                case 'ms':
                    categoryName = category.name_in_malay ?? category.name_in_english;
                    break;
                default:
                    categoryName = category.name_in_english;
                    break;
            }

            const dropdownMenuElement = document.createElement('A');
            dropdownMenuElement.href = '#';
            dropdownMenuElement.className = 'irlLevelDropdownItem';
            dropdownMenuElement.setAttribute('data-value', category.id);
            dropdownMenuElement.innerHTML = categoryName;

            if (!category.articles || category.articles.length === 0) {
                dropdownMenuElement.classList.add('disabled');
                dropdownMenuElement.style.pointerEvents = 'none';
                dropdownMenuElement.style.color = '#AAAAAA';
            }

            dropdownMenuElement.onclick = function (e) {
                e.preventDefault();
                if (category.articles && category.articles.length > 0) {
                    const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
                    tagButtons.forEach(function (btn) {
                        const tagId = btn.getAttribute('data-tag-id');
                        const hasArticles = (category.articles || []).some(function (article) {
                            return (article.tags || []).some(function (t) {
                                return (t.id ?? t) === parseInt(tagId);
                            });
                        });
                        btn.disabled = !hasArticles;
                        if (hasArticles) btn.classList.add('active');
                        else btn.classList.remove('active');
                    });

                    const levelDropdownLabel = affinHwangArticleListingContainer.querySelector('.irlLevelDropdownLabel');
                    if (levelDropdownLabel) levelDropdownLabel.textContent = categoryName;

                    initArticleListing(lang, data, category.id);
                }
            };

            irlLevelDropdownMenuElement.appendChild(dropdownMenuElement);
        });
    }

    const levelDropdown = affinHwangArticleListingContainer.querySelector('.irlLevelDropdown');
    const levelDropdownButton = levelDropdown ? levelDropdown.querySelector('.irlLevelDropdownButton') : null;
    const levelDropdownLabel = levelDropdown ? levelDropdown.querySelector('.irlLevelDropdownLabel') : null;
    const levelDropdownItems = levelDropdown ? levelDropdown.querySelectorAll('.irlLevelDropdownItem') : [];
    if (!levelDropdownButton) return;

    levelDropdownButton.addEventListener('click', function (e) {
        e.stopPropagation();
        levelDropdown.classList.toggle('show');
    });

    levelDropdownItems.forEach(function (item) {
        if (!item.classList.contains('disabled')) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const text = item.textContent;
                if (levelDropdownLabel) levelDropdownLabel.textContent = text;
                levelDropdown.classList.remove('show');
            });
        }
    });

    document.addEventListener('click', function (e) {
        if (!levelDropdown.contains(e.target)) levelDropdown.classList.remove('show');
    });

    if (selectedCategoryId) {
        const firstCategory = data.find(function (cat) {
            return cat.id === selectedCategoryId;
        });
        const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
        tagButtons.forEach(function (btn) {
            const tagId = parseInt(btn.getAttribute('data-tag-id'));
            const hasArticles = (firstCategory.articles || []).some(function (article) {
                return (article.tags || []).some(function (t) {
                    return (t.id ?? t) === tagId;
                });
            });
            if (hasArticles) {
                btn.classList.add('active');
                btn.disabled = false;
            } else {
                btn.classList.remove('active');
                btn.disabled = true;
            }
        });

        initArticleListing(lang, data, selectedCategoryId);
    }
}

function initTags(lang, data) {
    return fetch('/json/affin-hwang-articles/tags.json')
        .then(response => response.json())
        .then(tags => {
            tags.forEach(tag => {
                const tagsContainer = document.querySelector('.irlBlockAffinHwangArticleListing .irlCategoryTags');
                if (!tagsContainer) return;

                let tagName;
                let loadMoreText;
                switch (lang) {
                    case 'zh':
                        tagName = tag.name_in_chinese ?? tag.name_in_english;
                        loadMoreText = '查看更多';
                        break;
                    case 'ms':
                        tagName = tag.name_in_malay ?? tag.name_in_english;
                        loadMoreText = 'Lebih Lanjut';
                        break;
                    default:
                        tagName = tag.name_in_english;
                        loadMoreText = 'Load More';
                        break;
                }

                const tagElement = document.createElement('BUTTON');
                tagElement.type = 'button';
                tagElement.className = 'irlCategoryTag irlCategoryTag' + tag.id + ' mb-2';
                tagElement.setAttribute('data-tag-id', tag.id);
                tagElement.textContent = tagName;

                tagElement.onclick = function () {
                    if (!tagElement.disabled) {
                        tagElement.classList.toggle('active');
                        const section = document.querySelector('.irlBlockAffinHwangArticleListing .irlFilteredArticlesSection .irlArticleListTagId' + tag.id);
                        if (section) section.parentElement.style.display = tagElement.classList.contains('active') ? 'block' : 'none';
                    }
                };

                tagsContainer.appendChild(tagElement);

                const hasArticles = data.some(function (category) {
                    return (category.articles || []).some(function (article) {
                        return (article.tags || []).some(function (t) {
                            return (t.id ?? t) === tag.id;
                        });
                    });
                });

                if (!hasArticles) {
                    tagElement.disabled = true;
                } else {
                    tagElement.classList.add('active');
                }

                if (!hasArticles) return;

                const irlFilteredArticlesSectionElement = document.createElement('DIV');
                irlFilteredArticlesSectionElement.className = 'irlFilteredArticlesSection mb-5';
                irlFilteredArticlesSectionElement.innerHTML = `
                    <h2 class="irlSectionTitle mb-4 irltagSection${tag.id}">${tagName}</h2>
                    <div class="irlArticleList irlArticleListTagId${tag.id}"></div>
                    <div class="text-center mt-4">
                        <button type="button" class="irlLoadMoreButton irlLoadMoreButtonTagId${tag.id}">${loadMoreText}</button>
                    </div>
                `;

                const irlFilteredArticlesSectionContainerElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlFilteredArticlesSectionContainer');
                if (irlFilteredArticlesSectionContainerElement) {
                    irlFilteredArticlesSectionContainerElement.appendChild(irlFilteredArticlesSectionElement);
                }
            });

            const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
            let maxWidth = 0;
            tagButtons.forEach(function (btn) {
                btn.style.width = 'auto';
                if (btn.offsetWidth > maxWidth) maxWidth = btn.offsetWidth;
            });
            tagButtons.forEach(function (btn) {
                btn.style.width = maxWidth + 'px';
            });

            return tags;
        });
}

function initMobileFilterModal(lang, data) {
    const affinHwangArticleListingContainer = document.querySelector('.irlBlockAffinHwangArticleListing');
    if (!affinHwangArticleListingContainer) return;

    const modal = affinHwangArticleListingContainer.querySelector('#irlFilterModalOverlay');
    const openBtn = affinHwangArticleListingContainer.querySelector('#irlMobileFilterButton');
    const closeBtn = affinHwangArticleListingContainer.querySelector('#irlFilterModalClose');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeModal();
    });

    const levelContainer = modal.querySelector('.irlFilterButtons[data-filter-group="level"]');
    const topicContainer = modal.querySelector('.irlFilterButtons[data-filter-group="topic"]');

    const irlFilterLevelTitleElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlFilterLevelTitle');
    const irlFilterTopicTitleElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlFilterTopicTitle');

    let levelText;
    let topicText;
    switch (lang) {
        case 'zh':
            levelText = '等级';
            topicText = '主题';
            break;
        case 'ms':
            levelText = 'Tahap';
            topicText = 'Topik';
            break;
        default:
            levelText = 'Level';
            topicText = 'Topic';
            break;
    }

    if (irlFilterLevelTitleElement) {
        irlFilterLevelTitleElement.innerHTML = levelText;
    }

    if (irlFilterTopicTitleElement) {
        irlFilterTopicTitleElement.innerHTML = topicText;
    }

    if (levelContainer) levelContainer.innerHTML = '';
    if (topicContainer) topicContainer.innerHTML = '';

    if (!levelContainer || !topicContainer) return;

    const firstCategoryWithArticles = data.find(function (cat) {
        return cat.articles && cat.articles.length > 0;
    });

    const desktopTagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');

    data.forEach(function (category) {
        let categoryName;
        switch (lang) {
            case 'zh':
                categoryName = category.name_in_chinese ?? category.name_in_english;
                break;
            case 'ms':
                categoryName = category.name_in_malay ?? category.name_in_english;
                break;
            default:
                categoryName = category.name_in_english;
                break;
        }

        const hasArticles = category.articles && category.articles.length > 0;

        const levelButton = document.createElement('BUTTON');
        levelButton.type = 'button';
        levelButton.className = 'irlFilterButton';
        levelButton.setAttribute('data-filter-type', 'level');
        levelButton.setAttribute('data-value', category.id);
        levelButton.textContent = categoryName;

        if (!hasArticles) {
            levelButton.disabled = true;
            levelButton.classList.add('disabled');
        }

        if (firstCategoryWithArticles && category.id === firstCategoryWithArticles.id) {
            levelButton.classList.add('active');
        }

        levelButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (!hasArticles) return;

            const allLevelButtons = levelContainer.querySelectorAll('.irlFilterButton');
            allLevelButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            levelButton.classList.add('active');

            const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
            tagButtons.forEach(function (btn) {
                const tagId = btn.getAttribute('data-tag-id');
                const hasArticlesForTag = (category.articles || []).some(function (article) {
                    return (article.tags || []).some(function (t) {
                        return (t.id ?? t) === parseInt(tagId);
                    });
                });
                btn.disabled = !hasArticlesForTag;
                if (hasArticlesForTag) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            const levelDropdownLabel = affinHwangArticleListingContainer.querySelector('.irlLevelDropdownLabel');
            if (levelDropdownLabel) levelDropdownLabel.textContent = categoryName;

            initArticleListing(lang, data, category.id);

            const mobileTopicButtons = topicContainer.querySelectorAll('.irlFilterButton');
            mobileTopicButtons.forEach(function (btn) {
                const tagValue = btn.getAttribute('data-value');
                const desktopTag = document.querySelector('.irlBlockAffinHwangArticleListing .irlCategoryTag[data-tag-id="' + tagValue + '"]');
                if (desktopTag) {
                    btn.disabled = desktopTag.disabled;
                    if (desktopTag.classList.contains('active') && !desktopTag.disabled) btn.classList.add('active');
                    else btn.classList.remove('active');
                } else {
                    btn.disabled = true;
                    btn.classList.remove('active');
                }
            });
        });

        levelContainer.appendChild(levelButton);
    });

    desktopTagButtons.forEach(function (desktopTagButton) {
        const tagId = desktopTagButton.getAttribute('data-tag-id');
        const tagName = desktopTagButton.textContent;

        const topicButton = document.createElement('BUTTON');
        topicButton.type = 'button';
        topicButton.className = 'irlFilterButton';
        topicButton.setAttribute('data-filter-type', 'topic');
        topicButton.setAttribute('data-value', tagId);
        topicButton.textContent = tagName;
        topicButton.disabled = desktopTagButton.disabled;
        if (desktopTagButton.classList.contains('active') && !desktopTagButton.disabled) {
            topicButton.classList.add('active');
        }

        topicButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (topicButton.disabled) return;

            desktopTagButton.click();

            if (desktopTagButton.classList.contains('active')) {
                topicButton.classList.add('active');
            } else {
                topicButton.classList.remove('active');
            }
        });

        topicContainer.appendChild(topicButton);
    });
}

function filterArticlesBySearch(lang, data, selectedCategoryId, query) {
    const selectedCategory = data.find(function (cat) {
        return cat.id === selectedCategoryId;
    });
    if (!selectedCategory) return;

    const activeTagButtons = Array.prototype.slice.call(document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button.active:not(:disabled)'));
    const activeTagIds = activeTagButtons.map(function (btn) {
        return parseInt(btn.getAttribute('data-tag-id'));
    });

    const articlesByTag = {};

    const allSections = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlFilteredArticlesSection');
    allSections.forEach(function (section) {
        section.style.display = 'none';
    });

    (selectedCategory.articles || []).forEach(function (article) {
        let title;
        let description;
        switch (lang) {
            case 'zh':
                title = article.title_in_chinese ?? article.title_in_english;
                description = article.description_in_chinese ?? article.description_in_english;
                break;
            case 'ms':
                title = article.title_in_malay ?? article.title_in_english;
                description = article.description_in_malay ?? article.description_in_english;
                break;
            default:
                title = article.title_in_english;
                description = article.description_in_english;
                break;
        }
        const text = ((title || '') + ' ' + (description || '')).toLowerCase();
        if (!text.includes(query)) return;

        (article.tags || []).forEach(function (tag) {
            const tagId = tag.id ?? tag;
            const numericTagId = parseInt(tagId);
            if (activeTagIds.length > 0 && activeTagIds.indexOf(numericTagId) === -1) return;
            if (!articlesByTag[numericTagId]) {
                articlesByTag[numericTagId] = [];
            }
            articlesByTag[numericTagId].push(article);
        });
    });

    Object.keys(articlesByTag).forEach(function (tagId) {
        const container = document.querySelector('.irlBlockAffinHwangArticleListing .irlArticleListTagId' + tagId);
        const loadMoreButton = document.querySelector('.irlBlockAffinHwangArticleListing .irlLoadMoreButtonTagId' + tagId);
        if (!container || !loadMoreButton) return;

        container.innerHTML = '';

        let currentIndex = 0;
        const pageSize = 5;

        let loadMoreText;
        switch (lang) {
            case 'zh':
                loadMoreText = '查看更多';
                break;
            case 'ms':
                loadMoreText = 'Lebih Lanjut';
                break;
            default:
                loadMoreText = 'Load More';
                break;
        }
        loadMoreButton.textContent = loadMoreText;

        function renderNextArticles() {
            const nextArticles = articlesByTag[tagId].slice(currentIndex, currentIndex + pageSize);
            renderArticleListingByTag(lang, nextArticles, container);
            currentIndex += nextArticles.length;

            if (currentIndex >= articlesByTag[tagId].length) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }

        loadMoreButton.onclick = function () {
            renderNextArticles();
        };

        renderNextArticles();

        const section = container.parentElement;
        if (section) section.style.display = 'block';
    });

    const tagButtons = document.querySelectorAll('.irlBlockAffinHwangArticleListing .irlCategoryTags button');
    tagButtons.forEach(function (btn) {
        const tagId = btn.getAttribute('data-tag-id');
        const section = document.querySelector('.irlBlockAffinHwangArticleListing .irlFilteredArticlesSection .irlArticleListTagId' + tagId);
        if (!section) return;

        if (btn.classList.contains('active') && articlesByTag[tagId] && articlesByTag[tagId].length > 0) {
            section.parentElement.style.display = 'block';
        } else {
            section.parentElement.style.display = 'none';
        }
    });
}

function initMobileSearch(lang, data) {
    const container = document.querySelector('.irlBlockAffinHwangArticleListing');
    if (!container) return;

    const searchInput = container.querySelector('.irlMobileSearchInput');
    const searchIcon = container.querySelector('.irlMobileSearchIcon');

    if (!searchInput || !searchIcon) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!irlCurrentCategoryId) return;

        if (query === '') {
            initArticleListing(lang, data, irlCurrentCategoryId);
        } else {
            filterArticlesBySearch(lang, data, irlCurrentCategoryId, query);
        }
    }

    searchIcon.addEventListener('click', function (e) {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

function initMostViewArticles(lang) {
    const irlMostViewArticlesElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlMostViewArticles');
    if (!irlMostViewArticlesElement) return;

    fetch('/json/affin-hwang-articles/most-viewed.json')
        .then(response => response.json())
        .then(articles => {
            const mostViewArticles = articles.slice(0, 4);

            const params = new URLSearchParams(window.location.search);
            const isInApp = params.get('inApp') === 'true';

            if (isInApp) {
                const headerElement = document.querySelector('header');
                if (headerElement) {
                    headerElement.style.display = 'none';
                }
            }
            mostViewArticles.forEach(article => {
                let title, cover, articleDetailUrl;

                articleDetailUrl = `/${lang}/learn/details?v=${btoa(`articleId=${article.id}`)}`;
                articleDetailUrl = articleDetailUrl.replaceAll('%20', '-');

                if (isInApp) {
                    articleDetailUrl += '&inApp=true';
                }

                switch (lang) {
                    case 'zh':
                        title = article.title_in_chinese ?? article.title_in_english;
                        cover = article.cover_image_in_chinese ?? article.cover_image_in_english;
                        break;
                    case 'ms':
                        title = article.title_in_malay ?? article.title_in_english;
                        cover = article.cover_image_in_malay ?? article.cover_image_in_english;
                        break;
                    default:
                        title = article.title_in_english;
                        cover = article.cover_image_in_english;
                        break;
                }

                const mostViewArticleElement = document.createElement('A');
                mostViewArticleElement.className = 'irlSidebarCard d-flex mb-4 text-decoration-none';
                mostViewArticleElement.href = articleDetailUrl;
                mostViewArticleElement.innerHTML = `
                    <div class="irlSidebarImageWrapper">
                        <img src="${cover}" alt="${title}" class="img-fluid irlSidebarImage">
                    </div>
                    <div class="irlSidebarContent">
                        <h4 class="irlSidebarArticleTitle">${title}</h4>
                        <p class="irlSidebarArticleMeta">
                            <b class="text-dark">${article.author}</b> - <span>${article.date}</span>
                        </p>
                    </div>
                `;
                irlMostViewArticlesElement.appendChild(mostViewArticleElement);
            });

            const irlMostViewedArticleHeaderElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlMostViewedArticleHeader');
            if (irlMostViewedArticleHeaderElement) {
                let headerText;
                switch (lang) {
                    case 'zh':
                        headerText = '最多浏览文章';
                        break;
                    case 'ms':
                        headerText = 'Artikel Paling Banyak Dilihat';
                        break;
                    default:
                        headerText = 'Most Viewed Articles';
                        break;
                }
                irlMostViewedArticleHeaderElement.innerHTML = headerText;
            }
        });
}

function initMostLikedArticles(lang) {
    const irlMostLikedArticlesElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlMostLikeArticles');
    if (!irlMostLikedArticlesElement) return;

    fetch('/json/affin-hwang-articles/most-liked.json')
        .then(response => response.json())
        .then(articles => {
            const mostLikedArticles = articles.slice(0, 4);
            const params = new URLSearchParams(window.location.search);
            const isInApp = params.get('inApp') === 'true';

            if (isInApp) {
                const headerElement = document.querySelector('header');
                if (headerElement) {
                    headerElement.style.display = 'none';
                }
            }
            
            mostLikedArticles.forEach(article => {
                let title, cover, articleDetailUrl;

                articleDetailUrl = `/${lang}/learn/details?v=${btoa(`articleId=${article.id}`)}`;
                articleDetailUrl = articleDetailUrl.replaceAll('%20', '-');

                if (isInApp) {
                    articleDetailUrl += '&inApp=true';
                }

                switch (lang) {
                    case 'zh':
                        title = article.title_in_chinese ?? article.title_in_english;
                        cover = article.cover_image_in_chinese ?? article.cover_image_in_english;
                        break;
                    case 'ms':
                        title = article.title_in_malay ?? article.title_in_english;
                        cover = article.cover_image_in_malay ?? article.cover_image_in_english;
                        break;
                    default:
                        title = article.title_in_english;
                        cover = article.cover_image_in_english;
                        break;
                }

                const mostLikedArticleElement = document.createElement('A');
                mostLikedArticleElement.className = 'irlSidebarCard d-flex mb-4 text-decoration-none';
                mostLikedArticleElement.href = articleDetailUrl;
                mostLikedArticleElement.innerHTML = `
                    <div class="irlSidebarImageWrapper">
                        <img src="${cover}" alt="${title}" class="img-fluid irlSidebarImage">
                    </div>
                    <div class="irlSidebarContent">
                        <h4 class="irlSidebarArticleTitle">${title}</h4>
                        <p class="irlSidebarArticleMeta">
                            <b class="text-dark">${article.author}</b> - <span>${article.date}</span>
                        </p>
                    </div>
                `;
                irlMostLikedArticlesElement.appendChild(mostLikedArticleElement);
            });

            const irlMostLikedArticleHeaderElement = document.querySelector('.irlBlockAffinHwangArticleListing .irlMostLikedArticleHeader');
            if (irlMostLikedArticleHeaderElement) {
                let headerText;
                switch (lang) {
                    case 'zh':
                        headerText = '最多喜欢文章';
                        break;
                    case 'ms':
                        headerText = 'Artikel Paling Disukai';
                        break;
                    default:
                        headerText = 'Most Liked Articles';
                        break;
                }
                irlMostLikedArticleHeaderElement.innerHTML = headerText;
            }
        });
}

if (document.querySelector('.irlBlockAffinHwangArticleListing')) {
    function ready(f) {
        /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f();
    }

    ready(function () {
        if (document.querySelector('.irlBlockAffinHwangArticleListing')) {
            fetch('/currentLang')
                .then(response => response.text())
                .then(lang => {
                    initAffinHwangArticleListing(lang);
                });
        }
    });
}
