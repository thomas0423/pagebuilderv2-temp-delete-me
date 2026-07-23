function ready(f) { //FnC Storage
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
}

function setupFeeAndCharges() {
    const block_fnc = document.querySelectorAll('.block-fees-n-charges');
    for (let i = 0; i < block_fnc.length; i++) {
        block_fnc[i].id = "fnc-id-" + i;

        fncAccordion(block_fnc[i].id);
    }
}

function fncAccordion(parentClassName) {
    const fnc_col = document.querySelectorAll(`#${parentClassName} .fnc-collapsible`);
    let i;

    if (fnc_col) {
        for (i = 0; i < fnc_col.length; i++) {
            fnc_col[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                const parentContent = this.parentElement;

                if (parentContent.classList.contains("content") && parentContent.style.maxHeight) {
                    parentContent.style.maxHeight = parentContent.scrollHeight + content.scrollHeight + 'px';
                }

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }
                else {
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
                    }
                    else {
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
}

function fcnTabChange(event) {
    if (!event) return;

    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');
    // console.log(parentClassName);


    // const fnc_header_btn = document.querySelectorAll(`.${parentClassName} .fnc-sub-header-btn`);
    // const accordion_group = document.querySelectorAll(`.${parentClassName} .fnc-accordion-group`);

    const fnc_header_btn = document.querySelectorAll(`.block-fees-n-charges .fnc-sub-header-btn`);
    const accordion_group = document.querySelectorAll(`.block-fees-n-charges .fnc-accordion-group`);

    const clicked = event;

    fnc_header_btn.forEach(f => f.classList.remove('fnc-active'));
    accordion_group.forEach(f => f.style.display = 'none');
    clicked.classList.add('fnc-active');

    // document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).style.display = 'block';
    document.querySelector(`.block-fees-n-charges .tab-content--${clicked.dataset.tab}`).style.display = 'block';
}

ready(function() { // TODO: this is just a workaround, it should be fixed with properly logic in future
    let index = 0;
    const maxIndex = 60;

    const timer = setInterval(function() {
        if (document.querySelector('.block-fees-n-charges')) {
            setupFeeAndCharges();

            const islamicContent = document.querySelector('.block-fees-n-charges .fnc-accordion-group.affin-always-fnc-tab-2.tab-content--2');
            if (islamicContent) {
                //islamicContent.style.display = 'none';
            }
        }

        if (index >= maxIndex) {
            clearInterval(timer);
        } else {
            index++;
        }

    }, 1000)
})
