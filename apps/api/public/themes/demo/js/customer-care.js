function customerCareTabbedComponent(event)
{
    if (!event) return;
    
    let parentClassName = event.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className.replace(/\ /g, '.');
    // console.log(parentClassName);

    const tabs = document.querySelectorAll(`.${parentClassName} .cc-tab`);
    const tabsContent = document.querySelectorAll(`.${parentClassName} .tab-content`);
    const clicked = event.children[0];
    // console.log(clicked);

    tabs.forEach(t => t.classList.remove('tab--active'));
    tabsContent.forEach(c => c.classList.remove('content--active'));
    clicked.classList.add('tab--active');

    document.querySelector(`.${parentClassName} .tab-content--${clicked.dataset.tab}`).classList.add('content--active');

    //radio btn (Not used anymore, using their form from iframe)
    // const radioBtn = document.querySelectorAll(`.${parentClassName} .feedback-btn`);
    // const radioBtnContainer = document.querySelector(`.${parentClassName} .feedback-btn-container`);

    // if (radioBtnContainer) {
    //     radioBtnContainer.addEventListener('click', function (e) {
    //         const clicked = e.target.closest('.feedback-btn');

    //         if (!clicked) {
    //             return;
    //         }

    //         radioBtn.forEach(t => t.classList.remove('feedback-btn-selected'));
    //         clicked.classList.add('feedback-btn-selected');
    //     });
    // }
    
    //getURLParam(tabs, tabsContent);
}

function getURLParam(tabs, tabsContent) {
    fetch('/currentLang')
    .then(response => response.text())
    .then(lang => {
        var url = new URL(location.href);
        var section = url.searchParams.get('section');
        var sectionSelected;
        var sectionParent;
        var tempContactCenter;
        var tempBranchOperation;
        var tempOnlineFeed;
        var tempYourVoice;

        switch (lang) {
            case 'zh':
               
                break;
            case 'ms':
                tempContactCenter = "Pusat Panggilan";
                tempBranchOperation = "Waktu Operasi Cawagan"
                tempOnlineFeed = "Borang Maklum Balas";
                tempYourVoice = "Suarakan Pendapat Anda!"
                break;
            case 'en':
                default:
                    tempContactCenter = "Contact Center";
                    tempBranchOperation = "Branch Operation Hours"
                    tempOnlineFeed = "Online Feedback Form";
                    tempYourVoice = "Your Voice Counts!"
                break;
        }

        if (section) {
            if (section == "contactcenter") {
                // sectionSelected = $("p:contains(Pusat Panggilan)");
                sectionSelected = $("p:contains(" + tempContactCenter + ")");
            }
            else if (section == "branchoperation") {
                // sectionSelected = $("p:contains(Branch Operation Hours)");
                sectionSelected = $("p:contains(" + tempBranchOperation + ")");
            }
            else if (section == "onlinefeedback") {
                // sectionSelected = $("p:contains(Online Feedback Form)");
                sectionSelected = $("p:contains(" + tempOnlineFeed + ")");
            }
            else if (section == "yourvoice") {
                // sectionSelected = $("p:contains(Your Voice Counts!)");
                sectionSelected = $("p:contains(" + tempYourVoice + ")");
            }

            tabs.forEach(t => t.classList.remove('tab--active'));
            tabsContent.forEach(c => c.classList.remove('content--active'));
            sectionSelected.closest('.cc-tab')[0].classList.add('tab--active');

            document.querySelector(`.tab-content--${sectionSelected.closest('.cc-tab')[0].dataset.tab}`).classList.add('content--active');

            sectionParent = sectionSelected[1];

            // console.log(sectionParent);

            sectionParent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

if (document.querySelector('.block-customer-care')) {
    customerCareTabbedComponent();
}