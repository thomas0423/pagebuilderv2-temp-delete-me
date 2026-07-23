// Method to call if can get parent block unique id
// function setAccordion(parentClassName) {
//     let selectField = parentClassName.getElementsByClassName('accordion-select-field')[0];

//     if (selectField) {
//         selectField.onclick = function () {
//             //Change +,- symbol
//             selectField.children[1].classList.toggle("active");
//             //Open, close panel
//             var panel = selectField.nextElementSibling;
//             if (panel.style.maxHeight) {
//                 panel.style.maxHeight = null;
//             } else {
//                 panel.style.maxHeight = panel.scrollHeight + "px";
//             }
//         }
//     }
// }

// Temporary method where if cannot get parent block unique id
function setAccordion() {
    const acc = document.querySelectorAll('.accordion-select-field');
    let i;
    
    if (acc) {
        for (i = 0; i < acc.length; i++) {
            if (acc[i].onclick == null) {
                acc[i].onclick = function () {
                    //to change + symbol to -
                    this.children[1].classList.toggle("active");
                    
                    //open this accordion panel
                    var panel = this.nextElementSibling;
                    if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                    } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }
        }
    }
}

if (document.querySelector('.block-accordion')) {
    setAccordion();
}
