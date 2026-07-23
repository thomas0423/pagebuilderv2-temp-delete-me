function manualsAccordion() {
    const acc = document.querySelectorAll(`.manuals-collapsible`);
    let i;

    if (acc) {
        for (i = 0; i < acc.length; i++) {
            // if (acc[i].classList.contains("rnp-loaded")) return;
            // acc[i].classList.add("rnp-loaded");
            acc[i].addEventListener('click', function () {
                const content = this.nextElementSibling;
                const parentContent = this.parentElement;

                // console.log(parentContent);
                // console.log(content);

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

                    // console.log(temp);
                    // console.log(temp instanceof Element);

                    if (temp instanceof Element) {
                        // if (temp.classList.contains("accordion-symbol")) {
                        //     if (temp.innerHTML === '+') {
                        //         temp.innerHTML = "-";
                        //     } else {
                        //         temp.innerHTML = "+";
                        //     }
                        //     break;
                        // }
                    } else {
                        if (temp.classList && temp.classList.contains("accordion-symbol-level-1")) {
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

if (document.querySelector('.block-manuals')) {
    manualsAccordion();
}
