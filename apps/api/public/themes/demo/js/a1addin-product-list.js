function getA1addinProductListCategoryJson(lang) {
    fetch('/json/a1addin_product_list/categories.json')
        .then(response => response.json())
        .then(categories => {
            categories.sort(function (a, b) {
                return a.order - b.order;
            });

            for (let category of categories) {
                let title;
                let subtitle;
                let btnText;
                let img = category.img;
                let link;

                switch (lang) {
                    case 'ms':
                        title = category.title_in_malay ? category.title_in_malay : category.title_in_english;
                        subtitle = category.subtitle_in_malay ? category.subtitle_in_malay : category.subtitle_in_english;
                        btnText = category.button_text_in_malay ? category.button_text_in_malay : category.button_text_in_english;
                        link = '/bm/products?' + title;
                        break;
                    case 'zh':
                        title = category.title_in_chinese ? category.title_in_chinese : category.title_in_english;
                        subtitle = category.subtitle_in_chinese ? category.subtitle_in_chinese : category.subtitle_in_english;
                        btnText = category.button_text_in_chinese ? category.button_text_in_chinese : category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                    case 'en':
                        title = category.title_in_english;
                        subtitle = category.subtitle_in_english;
                        btnText = category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                    default:
                        title = category.title_in_english;
                        subtitle = category.subtitle_in_english;
                        btnText = category.button_text_in_english;
                        link = '/en/products?' + title;
                        break;
                }

                const categoryTitle = document.createElement('DIV');
                categoryTitle.innerHTML =
                    '<div class="card category-card">' +
                    '<div class="row">' +
                    '<div class="col-4 place-self-center">' +
                    '<img src="' + img + '" alt="category image" class="product-category-image">' +
                    '</div>' +
                    '<div class="col-8 px-4">' +
                    '<p class="category-card-title-text">' + title + '</p>' +
                    '<p class="category-card-subtitle-text">' + subtitle + '</p>' +
                    '<a href="' + link + '" target="_blank" class="category-btn-link"><div class="category-btn">' + btnText + '</div></a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                categoryTitle.className = title.replaceAll(' ', '_') + ' col-12 col-lg-6 a1addin-product-category-' + category.id;
                categoryTitle.id = 'product-category-' + category.id;

                const categoryContainer = document.querySelector('.block-a1addin-product-list .product-categories');
                if (categoryContainer) {
                    categoryContainer.appendChild(categoryTitle);
                }
            }
            setProductCategoryLeftRightButton();
        });
}

function setProductCategoryLeftRightButton() {
    const nextBtn = document.querySelector('.block-a1addin-product-list .fa-chevron-right.a1addin-product-category-arrow-icon');
    const prevBtn = document.querySelector('.block-a1addin-product-list .fa-chevron-left.a1addin-product-category-arrow-icon');
    const card = document.querySelectorAll('.block-a1addin-product-list .category-card');

    let cardWidth;
    if (card) {
        cardWidth = card[0].offsetWidth + 50;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            $('.block-a1addin-product-list .product-categories').animate({scrollLeft: '+=' + cardWidth}, 200);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            $('.block-a1addin-product-list .product-categories').animate({scrollLeft: '-=' + cardWidth}, 200);
        });
    }
}

showChatInterval = setInterval(function(){
    widget = $('.new-a1addin-chat-widget');
    if(widget){
        if(widget.is(':hidden')){
            console.log('hidden, displaying');
            $('.new-a1addin-chat-widget').attr('style', 'display: block !important');
            clearInterval(showChatInterval);
        }
        else{
        }
    }
    else{
    }
},1000)