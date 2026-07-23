function heroWithBtnList() {
    let blocks = document.getElementsByClassName('block-hero-with-btn-list');

    function highlighCurrentSelected() {
        for (let i = 0; i < blocks.length; i++) {
            let items = blocks[i].getElementsByClassName("item");

            for(let i = 0; i < items.length; i++){
                var myEventHandler = function () {
                    for(let j = 0; j < items.length; j++){
                        items[j].classList.remove("current-selected");
                    }
                    items[i].classList.add("current-selected");
                };
                $(items[i]).unbind('click', myEventHandler);
                $(items[i]).bind('click', myEventHandler);
            }
        }
    }

    
    function buttonSlider() {
        for (let j = 0; j < blocks.length; j++) {
            let btnRight = blocks[j].getElementsByClassName("btn-right")[0];
            let btnLeft = blocks[j].getElementsByClassName("btn-left")[0];

            var myEventHandler = function () {
                $('.button-container', blocks[j]).animate( { scrollLeft: '+=100' }, 200);
            };
            $(btnRight).unbind('click', myEventHandler);
            $(btnRight).bind('click', myEventHandler);

            var myEventHandler = function () {
                $('.button-container', blocks[j]).animate( { scrollLeft: '-=100' }, 200);
            };
            $(btnLeft).unbind('click', myEventHandler);
            $(btnLeft).bind('click', myEventHandler);
        }
    }

    highlighCurrentSelected();
    buttonSlider();
}

if (document.querySelector('.block-hero-with-btn-list')) {
    heroWithBtnList();
}

