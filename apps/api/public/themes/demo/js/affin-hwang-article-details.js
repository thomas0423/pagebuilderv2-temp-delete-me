function injectCustomStyleAndScript(article) {
    if (article.custom_style && article.custom_style.trim()) {
        const styleEl = document.createElement('style');
        styleEl.textContent = article.custom_style.trim();
        document.head.appendChild(styleEl);
    }
    if (article.custom_script && article.custom_script.trim()) {
        setTimeout(function () {
            const scriptEl = document.createElement('script');
            scriptEl.textContent = article.custom_script.trim();
            document.body.appendChild(scriptEl);
        }, 600);
    }
}

function initAffinHwangArticle(lang) {
    fetch('/json/affin-hwang-articles/index.json')
        .then(response => response.json())
        .then(data => {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            const paramsUrl = new URL(
                window.location.protocol +
                '//' +
                window.location.hostname +
                window.location.pathname +
                '?' +
                atob(url.searchParams.get('v'))
            );
            const articleId = paramsUrl.searchParams.get('articleId');
            const isInApp = url.searchParams.get('inApp') === 'true';

            if (isInApp) {
                const backToBlogButtonElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlBackButtonContainer');
                if (backToBlogButtonElement) {
                    backToBlogButtonElement.style.setProperty('padding-top', '0', 'important');
                }
            }

            const article = data.flatMap(category => category.articles || []).find(article => String(article.id) === String(articleId));

            let backButtonText, articleTitleText, articleBanner, articleContent, shareText;
            switch (lang) {
                case 'zh':
                    backButtonText = '返回博客';
                    articleTitleText = article.title_in_chinese ?? article.title_in_english;
                    articleBanner = article.banner_image_in_chinese ?? article.banner_image_in_english;
                    articleContent = article.content_in_chinese ?? article.content_in_english;
                    shareText = '分享';
                    break;
                case 'ms':
                    backButtonText = 'Kembali ke Blog';
                    articleTitleText = article.title_in_malay ?? article.title_in_english;
                    articleBanner = article.banner_image_in_malay ?? article.banner_image_in_english;
                    articleContent = article.content_in_malay ?? article.content_in_english;
                    shareText = 'Kongsi';
                    break;
                default:
                    backButtonText = 'Back to Blog';
                    articleTitleText = article.title_in_english;
                    articleBanner = article.banner_image_in_english;
                    articleContent = article.content_in_english;
                    shareText = 'Share';
                    break;
            }

            const irlBackButtonElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlBackButton');
            if (irlBackButtonElement) {
                irlBackButtonElement.href = `/${lang}/learn${isInApp ? '?inApp=true' : ''}`;
            }

            const irlBackButtonTextElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlBackButtonText');
            if (irlBackButtonTextElement) {
                irlBackButtonTextElement.innerHTML = backButtonText;
            }

            const irlArticleTitleContainerElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlArticleTitleContainer');
            if (irlArticleTitleContainerElement) {
                irlArticleTitleContainerElement.innerHTML = articleTitleText;
            }

            const irlArticleAuthorElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlArticleAuthor');
            if (irlArticleAuthorElement) {
                irlArticleAuthorElement.innerHTML = article.author;
            }

            const irlArticleDateElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlArticleDate');
            if (irlArticleDateElement) {
                irlArticleDateElement.innerHTML = article.date;
            }

            const irlArticleBannerElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlArticleBanner');
            if (irlArticleBannerElement) {
                irlArticleBannerElement.src = articleBanner;
                irlArticleBannerElement.alt = articleTitleText;
            }

            const irlArticleContentElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlArticleContent');
            if (irlArticleContentElement) {
                irlArticleContentElement.innerHTML = articleContent;
            }

            const irlShareTextElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlShareText');
            if (irlShareTextElement) {
                irlShareTextElement.innerHTML = shareText;
            }

            initArticleTableOfContents(lang);

            initLikeButton(article);

            initShareButton();

            injectCustomStyleAndScript(article);

            setTimeout(() => {
                addView(articleId);
            }, 30000);
        });
}

function addView(articleId) {
    return fetch(`/api/articles/${articleId}/add-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
}

function addLike(articleId) {
    return fetch(`/api/articles/${articleId}/add-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
}

function initLikeButton(article) {
    let likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
    const likeButtonElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlLikeButton');
    const irlLikeCountElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlLikeCount');

    if (!likeButtonElement || !irlLikeCountElement) return;

    fetch('/json/affin-hwang-articles/like_counts.json')
        .then(response => response.json())
        .then(likeCounts => {
            const record = likeCounts.find(item => item.id === article.id);
            const likeCount = record ? record.like_count : 0;
            irlLikeCountElement.innerHTML = likeCount;

            if (likedArticles.includes(article.id)) {
                likeButtonElement.classList.add('irlArticleLiked');
            }

            likeButtonElement.addEventListener('click', () => {
                if (likedArticles.includes(article.id)) return;

                likeButtonElement.classList.add('irlArticleLiked');
                irlLikeCountElement.innerHTML = likeCount + 1;

                likedArticles.push(article.id);
                localStorage.setItem('likedArticles', JSON.stringify(likedArticles));

                addLike(article.id).catch(() => { });
            });
        });
}

function initShareButton() {
    setTimeout(function () {
        $('.irlBlockAffinHwangArticleDetails #irlShareBlock').cShare({
            showButtons: ['fb', 'whatsapp', 'twitter', 'email'],
            shareToText: 'Share to'
        });
        const shareThisBtn = document.querySelector('.irlBlockAffinHwangArticleDetails .irlShareButton');
        if (shareThisBtn) {
            shareThisBtn.addEventListener('click', function () {
                const shareBlock = document.querySelector('.irlBlockAffinHwangArticleDetails #irlShareBlock');
                if (shareBlock) {
                    if (shareBlock.classList.contains('d-none')) {
                        shareBlock.classList.remove('d-none');
                    } else {
                        shareBlock.classList.add('d-none');
                    }
                }
            })
        }
    }, 500);
}

function initArticleTableOfContents(lang) {
    const container = document.querySelector('.irlBlockAffinHwangArticleDetails');
    if (!container) return;

    const contentElement = container.querySelector('.irlArticleContent');
    if (!contentElement) return;

    const headings = contentElement.querySelectorAll('h2');
    if (!headings.length) {
        const footerBtnWrapper = container.querySelector('.irlTableOfContentsMobile');
        const overlay = container.querySelector('#irlTOCModalOverlay');
        if (footerBtnWrapper) footerBtnWrapper.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        return;
    }

    const footerBtnWrapper = container.querySelector('.irlTableOfContentsMobile');
    const floatingButton = container.querySelector('.irlTOCFloatingButton');
    const floatingButtonText = container.querySelector('.irlTOCFloatingButtonText');
    const floatingButtonIcon = container.querySelector('.irlTOCFloatingButtonIcon');
    const overlay = container.querySelector('#irlTOCModalOverlay');
    const modalHeader = container.querySelector('.irlTOCModalHeader');
    const modalClose = container.querySelector('.irlTOCModalClose');
    const itemsContainer = container.querySelector('.irlTOCItems');

    if (!footerBtnWrapper || !floatingButton || !overlay || !modalHeader || !itemsContainer) return;

    let headerText;
    switch (lang) {
        case 'zh':
            headerText = '目录';
            break;
        case 'ms':
            headerText = 'Table of Contents';
            break;
        default:
            headerText = 'Table of Contents';
            break;
    }

    if (floatingButtonText) floatingButtonText.innerHTML = headerText;
    if (modalHeader) modalHeader.innerHTML = headerText;

    itemsContainer.innerHTML = '';

    headings.forEach(function (heading, index) {
        let id = heading.getAttribute('id');
        if (!id) {
            const base = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            id = base || ('section-' + index);
            if (document.getElementById(id)) {
                id = id + '-' + index;
            }
            heading.setAttribute('id', id);
        }

        const text = heading.textContent.trim() || ('Section ' + (index + 1));

        const btn = document.createElement('BUTTON');
        btn.type = 'button';
        btn.className = 'irlTOCItemButton';
        btn.textContent = text;

        btn.addEventListener('click', function () {
            closeOverlay();
            const target = document.getElementById(id);
            if (target) {
                const rect = target.getBoundingClientRect();
                const absoluteY = rect.top + window.pageYOffset;
                const offsetY = absoluteY - window.innerHeight * 0.10;

                window.scrollTo({
                    top: offsetY,
                    behavior: 'smooth'
                });
            }
        });

        itemsContainer.appendChild(btn);
    });

    function openOverlay() {
        overlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        if (floatingButtonIcon) floatingButtonIcon.style.transform = 'rotate(180deg)';
    }

    function closeOverlay() {
        overlay.classList.remove('is-active');
        document.body.style.overflow = '';
        if (floatingButtonIcon) floatingButtonIcon.style.transform = 'rotate(0deg)';
    }

    floatingButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (overlay.classList.contains('is-active')) {
            closeOverlay();
        } else {
            openOverlay();
        }
    });

    if (modalClose) {
        modalClose.addEventListener('click', function (e) {
            e.preventDefault();
            closeOverlay();
        });
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
}

function initMostViewArticlesInDetailsPage(lang) {
    const irlMostViewArticlesElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlMostViewedArticles');
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

            const irlMostViewedArticleTitleElement = document.querySelector('.irlBlockAffinHwangArticleDetails .irlMostViewedArticlesTitle');
            if (irlMostViewedArticleTitleElement) {
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
                irlMostViewedArticleTitleElement.innerHTML = headerText;
            }
        });
}

if (document.querySelector('.irlBlockAffinHwangArticleDetails')) {
    function ready(f) {
        /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f();
    }

    ready(function () {
        if (document.querySelector('.irlBlockAffinHwangArticleDetails')) {
            fetch('/currentLang')
                .then(response => response.text())
                .then(lang => {
                    initAffinHwangArticle(lang);
                    initMostViewArticlesInDetailsPage(lang);
                });
        }
    });
}
