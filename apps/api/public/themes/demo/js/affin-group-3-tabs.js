function switchAffinGroup3Tab(tabName, event) {
    let parentClassName = event.parentElement.parentElement.className.replace(/\ /g, '.');

    const tabs = document.querySelectorAll(`.${parentClassName} .tab`);
    let tabsChecker = [];

    for (let i = 0; i < tabs.length; i++) {
        if(!tabsChecker.includes(tabs[i].className)) {
            tabs[i].style.display = "none";
            tabsChecker.push(tabs[i].className);
        }
    }

    const tab = document.querySelector(`.${parentClassName} .tab.${tabName}`);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll(`.${parentClassName} .tab-title`);
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.querySelector(`.${parentClassName} .tab-title.${tabName}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

function switchTab3FirstTab() {
    const allTabs = document.querySelectorAll(".block-affin-group-3-tabs .tab");

    for (let i = 0; i < allTabs.length; i++) {
        if(!allTabs[i].classList.contains("tab-1")) {
            allTabs[i].style.display = "none";
        }
    }
}

if (document.querySelector('.block-affin-group-3-tabs')) {
    switchTab3FirstTab();
}