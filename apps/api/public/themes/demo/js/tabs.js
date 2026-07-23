function affinAlwaysSwitchToTab(tabName) {
    const tabs = document.querySelectorAll('.block-affin-always-tabs .tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    const tab = document.getElementById(tabName);
    if (tab) {
        tab.style.display = "block";
    }

    const headerTab = document.querySelectorAll('.tab-links');
    if (headerTab) {
        for (let j = 0; j < headerTab.length; j++) {
            headerTab[j].classList.remove('active');
        }
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
}

affinAlwaysSwitchToTab('services');
