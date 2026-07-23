function ready(f) {
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
}

function setRatesAndPricing() {
    const block_rnp = document.querySelectorAll('.block-rates-and-pricing');
    for (let i = 0; i < block_rnp.length; i++) {
        block_rnp[i].id = "rnp-id-" + i;

        getJsonDataRnP(block_rnp[i].id);
    }
}

function getJsonDataRnP(parentClassName) {
    fetch('/storage/rates/forex-1-unit.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const forex_1_content = document.querySelector(`#${parentClassName} .forex-1`);

                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {
                        let currency;
                        let code;
                        let selling;
                        let buying_tt;
                        let buying_od;
                        let imgArray = ['U.S.DOLLAR.svg', 'EURO.svg', 'BRITISH POUND.svg', 'SINGAPORE DOLLAR.svg', 'BRUNEI DOLLAR.svg', 'AUSTRALIAN DOLLAR.svg', 'CANADIAN DOLLAR.svg', 'NEW ZEALAND DOLLAR.svg', 'SWISS FRANC.svg'];

                        switch (lang) {
                            case 'ms':
                            const forex_1_text = document.querySelectorAll(`#${parentClassName} .sub-text-paragraph`)[0];
                            forex_1_text.innerHTML = "RM tempatan kepada satu unit Matawang Asing";
                            const forex_100_text = document.querySelectorAll(`#${parentClassName} .sub-text-paragraph`)[1];
                            forex_100_text.innerHTML = "RM tempatan kepada 100 unit Matawang Asing";
                                break;
                            case 'en':
                            default:
                                break;
                        }

                        for (let i = -1; i < data.length; i++) {

                            const ratesElement = document.createElement('DIV');

                            if(i < 0) {
                                switch (lang) {
                                    case 'ms':
                                        ratesElement.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Jualan TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian OD</div>';
                                            ratesElement.className = 'rates-details';
                                        break;
                                    case 'en':
                                    default:
                                        ratesElement.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Selling TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying OD</div>';
                                            ratesElement.className = 'rates-details';
                                        break;
                                }
                            } else {

                                currency = data[i].currency;
                                code = data[i].code;
                                selling = data[i].selling.ttod;
                                buying_tt = data[i].buying.tt;
                                buying_od = data[i].buying.od;

                                if (selling == "#VALUE!") { selling = "N/A"; }
                                if (buying_tt == "#VALUE!") { buying_tt = "N/A"; }
                                if (buying_od == "#VALUE!") { buying_od = "N/A"; }

                                ratesElement.innerHTML =
                                    '<img src="/img/' + imgArray[i] + '" class="flag-img" alt=""/>' +
                                    '<div class="sub-text-currency-code mt-2">'+ currency + '</div>' +
                                    '<div class="sub-text-currency-code">'+ code + '</div>' +
                                    '<div class="sub-text-buy-sell">'+ selling + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_tt + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_od + '</div>';
                                    ratesElement.className = 'rates-details';
                                }

                                if (forex_1_content) {
                                    forex_1_content.append(ratesElement);
                                }
                            }
                    });
            }

        fetch('/storage/rates/forex-100-unit.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const forex_100_content = document.querySelector(`#${parentClassName} .forex-100`);

                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {

                        let currency;
                        let code;
                        let selling;
                        let buying_tt;
                        let buying_od;
                        let imgArray = ['DANISH KRONE.svg', 'HONG KONG DOLLAR.svg', 'INDIAN RUPEE.svg', 'INDONESIAN RUPIAH.svg', 'JAPANESE YEN.svg', 'NORWEGIAN KRONE.svg', 'PAKISTAN RUPEE.svg', 'PHILIPPINE PESO.svg', 'SAUDI RIYAL.svg', 'SOUTH AFRICAN RAND.svg', 'SWEDISH KRONA.svg', 'THAI BAHT.svg', 'FIJI DOLLAR.svg', 'PAPUA NEW GUINEA KINA.svg', 'OMAN RIAL.svg', 'BANGLADESH TAKA.svg', 'SRI LANKA RUPEE.svg', 'KUWAIT DINAR.svg', 'CHINESE RENMINBI.svg', 'UAE DIRHAM.svg'];

                        for (let i = -1; i < data.length; i++) {

                            const ratesElement100 = document.createElement('DIV');

                            if(i < 0) {
                                switch (lang) {
                                    case 'ms':
                                        ratesElement100.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Jualan TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Belian OD</div>';
                                            ratesElement100.className = 'rates-details';
                                        break;
                                    case 'en':
                                    default:
                                        ratesElement100.innerHTML =
                                            '<div class="sub-text-buy-sell text-left">Selling TT/OD</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying TT</div>' +
                                            '<hr class="dotted-hr-grey">' +
                                            '<div class="sub-text-buy-sell text-left">Buying OD</div>';
                                            ratesElement100.className = 'rates-details';
                                        break;
                                }
                            } else {

                                currency = data[i].currency;
                                code = data[i].code;
                                selling = data[i].selling.ttod;
                                buying_tt = data[i].buying.tt;
                                buying_od = data[i].buying.od;

                                if (selling == "#VALUE!") { selling = "N/A"; }
                                if (buying_tt == "#VALUE!") { buying_tt = "N/A"; }
                                if (buying_od == "#VALUE!") { buying_od = "N/A"; }

                                ratesElement100.innerHTML =
                                    '<img src="/img/' + imgArray[i] + '" class="flag-img" alt=""/>' +
                                    '<div class="sub-text-currency-code mt-2">'+ currency + '</div>' +
                                    '<div class="sub-text-currency-code">'+ code + '</div>' +
                                    '<div class="sub-text-buy-sell">'+ selling + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_tt + '</div>' +
                                    '<hr class="dotted-hr-grey">' +
                                    '<div class="sub-text-buy-sell">'+ buying_od + '</div>';
                                    ratesElement100.className = 'rates-details';
                            }

                            if (forex_100_content) {
                                forex_100_content.append(ratesElement100);
                            }
                        }
                        setAccordionRnP(parentClassName);
                    });
            }
        });

        fetch('/storage/rates/forex-date.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                fetch('/currentLang')
                    .then(response => response.text())
                    .then(lang => {
                        const forex_date = document.querySelectorAll(`#${parentClassName} .sub-text-warning.mt-2`)[0];
                        const rates_quoted_text = document.querySelectorAll(`#${parentClassName} .sub-text-warning.mt-2`)[1];

                        let date = data[0].date;

                        switch (lang) {
                            case 'ms':
                                date = date.replace('EXCHANGE RATE AS AT','KADAR PERTUKARAN SETAKAT').replace('TIME', 'MASA').replace('AM','PAGI').replace('PM','PETANG');
                                rates_quoted_text.innerHTML = "Kadar yang disebutkan adalah berdasarkan Kadar Kaunter Pertukaran Wang Asing harian AFFIN BANK dan boleh berubah tanpa notis terlebih dahulu.";
                                break;
                            case 'en':
                            default:
                                break;
                        }

                        if (forex_date) {
                            forex_date.innerHTML = '(' + date + ')';
                        }
                    });
            }
        });
    });
}

function changeTabsRnP(event) {
    if (!event) return;

    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.block-rates-and-pricing .r-n-p-tab`);
    const tabsContent = document.querySelectorAll(`.block-rates-and-pricing .tab-content`);

    const clicked = event;

    tabs.forEach(t => t.classList.remove('tab--active'));
    tabsContent.forEach(c => c.classList.remove('content--active'));
    clicked.classList.add('tab--active');

    document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).classList.add('content--active');
}

function setAccordionRnP(parentClassName) {
    const acc = document.querySelectorAll(`#${parentClassName} .r-n-p-collapsible`);
    let i;

    if (acc) {
        for (i = 0; i < acc.length; i++) {
            // if (acc[i].classList.contains("rnp-loaded")) return;
            // acc[i].classList.add("rnp-loaded");
            acc[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                const parentContent = this.parentElement;

                if (parentContent.classList.contains("content") && parentContent.style.maxHeight) {
                    parentContent.style.maxHeight = parentContent.scrollHeight + content.scrollHeight + 'px';
                }

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                for (let i = 0; i < this.childNodes.length; i++) {
                    const temp = this.childNodes[i];

                    if (temp instanceof Element) {
                        if (temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    } else {
                        if (temp.classList && temp.classList.contains("accordion-symbol")) {
                            if (temp.innerHTML === '+') {
                                temp.innerHTML = "-";
                            } else {
                                temp.innerHTML = "+";
                            }
                            break;
                        }
                    }
                }
            });
        }
    }

    setOverflowBtnRnP(parentClassName);
}

function setOverflowBtnRnP(parentClassName){
    const forex_1_next_btn = document.querySelector(`#${parentClassName} .forex-1__button--next`);
    const forex_1_prev_btn = document.querySelector(`#${parentClassName} .forex-1__button--prev`);
    const forex_100_next_btn = document.querySelector(`#${parentClassName} .forex-100__button--next`);
    const forex_100_prev_btn = document.querySelector(`#${parentClassName} .forex-100__button--prev`);

    if ($(`#${parentClassName} .forex-1`)[0] && ($(`#${parentClassName} .forex-1`)[0].scrollWidth >  $(`#${parentClassName} .forex-1`).innerWidth())) {
        // alert("1 show");
        $(forex_1_next_btn).show();
        $(forex_1_prev_btn).show();
    } else {
        // alert("1 hide");
        $(forex_1_next_btn).hide();
        $(forex_1_prev_btn).hide();
    }

    if ($(`#${parentClassName} .forex-100`)[0] && ($(`#${parentClassName} .forex-100`)[0].scrollWidth >  $(`#${parentClassName} .forex-100`).innerWidth())) {
        // alert("100 show");
        $(forex_100_next_btn).show();
        $(forex_100_prev_btn).show();
    } else {
        // alert("100 hide");
        $(forex_100_next_btn).hide();
        $(forex_100_prev_btn).hide();
    }

    if (forex_1_next_btn) {
        forex_1_next_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-1`).animate({scrollLeft: '+=200'}, 200);
        });
    }

    if (forex_1_prev_btn) {
        forex_1_prev_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-1`).animate({scrollLeft: '-=200'}, 200);
        });
    }

    if (forex_100_next_btn) {
        forex_100_next_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-100`).animate({scrollLeft: '+=200'}, 200);
        });
    }

    if (forex_100_prev_btn) {
        forex_100_prev_btn.addEventListener('click', function () {
            $(`#${parentClassName} .forex-100`).animate({scrollLeft: '-=200'}, 200);
        });
    }
}


ready(function() { // TODO: this is just a workaround, it should be fixed with properly logic in future
    let index = 0;
    const maxIndex = 60;

    const timer = setInterval(function() {
        if (document.querySelector('.block-rates-and-pricing')) {
            setRatesAndPricing();
	    clearInterval(timer);
        }

        if (index >= maxIndex) {
            clearInterval(timer);
        } else {
            index++;
        }

    }, 1000)
})