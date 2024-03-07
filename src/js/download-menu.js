const downloadMenu = document.querySelector('.download-menu');
const downloadIcon = document.querySelector('.download-menu__icon--dl');
const downloadMenuList = document.querySelector('.download-menu__list');
const downloadItems = document.querySelectorAll('.download-menu__item');
const body = document.body;

const downloadItemPDF = document.querySelector('.download-menu__item--pdf');
const downloadIconPDF = document.querySelector('.download-menu__icon--pdf');
const downloadItemDOC = document.querySelector('.download-menu__item--doc');
const downloadIconDOC = document.querySelector('.download-menu__icon--doc');
const downloadItemPPT = document.querySelector('.download-menu__item--ppt');
const downloadIconPPT = document.querySelector('.download-menu__icon--ppt');

const downloadPDF = document.querySelector('.download-menu__item--pdf a');
const downloadDOC = document.querySelector('.download-menu__item--doc a');
const downloadPPT = document.querySelector('.download-menu__item--ppt a');

function openDownloadMenu() {
    downloadMenu.style.backgroundColor = '#313340';
    downloadIcon.style.fill = '#ffffff';
    downloadMenuList.style.height = 180 + 'px';
    downloadItems.forEach(item => {
        item.style.opacity = 1;
    });
    downloadItems.forEach((item, index) => {
        switch (index) {
            case 0:
                item.style.top = 45 + 'px';
            break;
            case 1:
                item.style.top = 90 + 'px';
            break;
            case 2:
                item.style.top = 135 + 'px';
            break;
            default:
                console.log("Collection is empty");
        }
    });
}

function closeDownloadMenu() {
    downloadMenu.style.backgroundColor = 'transparent';
    downloadIcon.style.fill = '#313340';
    downloadMenuList.style.height = 100 + '%';
    downloadItems.forEach(item => {
        item.style.opacity = 0;
    });
    downloadItems.forEach(item => {
            item.style.top = 0;
    });
}

function addHoverBtn(item, svg) {
    item.style.backgroundColor = '#313340';
    svg.style.fill = '#ffffff';
}

function removeHoverBtn(item, svg) {
    item.style.backgroundColor = 'transparent';
    svg.style.fill = '#313340';
}

downloadMenu.addEventListener('touchstart', function(event) {
    event.preventDefault();
    openDownloadMenu();
});

downloadPDF.addEventListener('touchstart', function(event) {
    event.stopPropagation();
    removeHoverBtn(downloadItemDOC, downloadIconDOC);
    removeHoverBtn(downloadItemPPT, downloadIconPPT);
    addHoverBtn(downloadItemPDF, downloadIconPDF);
});

downloadDOC.addEventListener('touchstart', function(event) {
    event.stopPropagation();
    removeHoverBtn(downloadItemPDF, downloadIconPDF);
    removeHoverBtn(downloadItemPPT, downloadIconPPT);
    addHoverBtn(downloadItemDOC, downloadIconDOC);
});

downloadPPT.addEventListener('touchstart', function(event) {
    event.preventDefault();

    if (downloadMenuList.offsetHeight > 160) {
        removeHoverBtn(downloadItemPDF, downloadIconPDF);
        removeHoverBtn(downloadItemDOC, downloadIconDOC);
        addHoverBtn(downloadItemPPT, downloadIconPPT);
        downloadPPT.click();
    }
});

body.addEventListener('touchstart', function(event) {
    if(event.target.closest('.download-menu__list') === null) {
        removeHoverBtn(downloadItemPDF, downloadIconPDF);
        removeHoverBtn(downloadItemDOC, downloadIconDOC);
        removeHoverBtn(downloadItemPPT, downloadIconPPT);
        closeDownloadMenu();
    }
});