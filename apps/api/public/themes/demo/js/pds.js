function pdsAccordion(id, parentClassName) {
    const firstCategory = document.querySelector('.' + parentClassName + ' #' + id);
    if (firstCategory) {
        firstCategory.classList.add('active');
    }

    const coll = document.querySelectorAll('.' + parentClassName + ' .pds-collapsible');
    let i, j;

    if (coll) {
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
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
                    }
                }
            });
        }
    }

    const header_btn = document.querySelectorAll('.' + parentClassName + ' .pds-header-btn');
    const accordion_group = document.querySelectorAll('.' + parentClassName + ' .pds-accordion-group');

    for (let j = 0; j < accordion_group.length; j++) {
        accordion_group[j].style.display = 'none';
    }

    for (i = 0; i < header_btn.length; i++) {
        if (i < 1) {
            accordion_group[i].style.display = "block";
        } else {
            accordion_group[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-t-n-c')) {
    pdsAccordion();
}
