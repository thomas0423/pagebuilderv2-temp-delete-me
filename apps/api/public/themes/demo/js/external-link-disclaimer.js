$(document).on('click', 'a', function (e) {
    e.preventDefault();
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            const isExternalLink = this.href.indexOf('192') < 0 &&
                this.href.indexOf('localhost') < 0 &&
                this.href.indexOf('aa-dev.cakexp.com') < 0 &&
                this.href.indexOf('a1-dev.cakexp.com') < 0 &&
                this.href.indexOf('ag-dev.cakexp.com') < 0 &&
                this.href.indexOf('affinalways.com') < 0 &&
                this.href.indexOf('affingroup.com') < 0 &&
                this.href.indexOf('a1addin.com') < 0 &&
                this.href.indexOf('affinalways-dev.cakexp.com') < 0 &&
                this.href.indexOf('affingroup-dev.cakexp.com') < 0 &&
                this.href.indexOf('a1addin-dev.cakexp.com') < 0 &&
                this.href.indexOf('affinonline.com') < 0 &&
                this.href.indexOf('javascript:void(0);') < 0 &&
                this.href.indexOf('affinbank.com.my') < 0 &&
                this.href.indexOf('affinislamic.com.my') < 0 &&
                this.href.indexOf('affin.com.my') < 0 &&
                this.href.indexOf('affinhwang.com') < 0 &&
                this.href.indexOf('172') < 0 &&
                this.href.indexOf('affinmax.com') < 0 &&
                this.href.indexOf('google.com.my') < 0 &&
                this.href.indexOf('test.salesforce.com') < 0 &&
                this.href.indexOf('affininvikta.com') < 0 &&
                this.href.indexOf('mysanafnb155:7005') < 0 &&
                this.href.indexOf('affinhwang.com') < 0;

            const isYoutubeLink = this.href.indexOf('youtube.com') > 0;

            if (this.getAttribute('onclick')) {
                e.preventDefault();
                eval(this.getAttribute('onclick'));
            } else {
                if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                } else if (isExternalLink) {
                    e.preventDefault();
                    if (window.location.href !== 'about:blank') {
                        security_not(this.href, lang);
                    }
                } else if (!isExternalLink) {
                    e.preventDefault();
                    if (window.location.href !== 'about:blank') {
                        const path = window.location.pathname;
                        if (path.indexOf('preview') >= 0) {
                            const href = this.getAttribute('href');
                            const pageName = (href.split('/')).pop();
                            if (pageName.indexOf('pageId') < 0 && (href.indexOf('https://') < 0 && href.indexOf('http://') < 0)) {
                                fetch('/getPageId/pageId?page_name=' + pageName)
                                    .then(response => response.text())
                                    .then(pageId => {
                                        if (href.indexOf('preview') < 0) {
                                            const previewHref = '/preview/' + href + '?pageId=' + pageId;
                                            this.setAttribute('href', previewHref);
                                        }
                                        window.open(this.getAttribute('href'), '_self');
                                    });
                            } else {
                                window.open(this.getAttribute('href'), '_self');
                            }
                        } else {
                            window.open(this.getAttribute('href'), '_self');
                        }
                    }
                }
            }
        });
});

function security_not(url, lang) {
    let cancelBtn = 'Cancel';
    let proceedButton = 'Proceed';
    if (lang === 'ms') {
        cancelBtn = 'Batal';
        proceedButton = 'Teruskan';
    }
    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: [
            {
                class: 'cancelButtonClass',
                text: cancelBtn,
                click: function () {
                    $(this).dialog('destroy');
                }
            },
            {
                class: 'proceedButtonClass',
                text: proceedButton,
                click: function () {
                    window.open(url, '_blank');
                    $(this).dialog('destroy');
                }
            }
        ]
    });
}
