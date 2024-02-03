"use strict";

function createChainElem(tag, arrClassesName, firstItemElem) {
    const chain = document.createElement(tag);
    chain.classList.add(...arrClassesName);
    firstItemElem.before(chain);
    return chain;
}

// Find first elements for add chains
const firstItemEducation = document.querySelector('.education__additional .exp__item');
const firstItemWorkExp = document.querySelector('.work-exp__content .exp__item');

// Create chains and put them to page
const chainEducation = createChainElem('div', ['chain', 'chain_education-add'], firstItemEducation);
const chainWork = createChainElem('div', ['chain', 'chain_work-exp'], firstItemWorkExp);

// Find parents blocks for items
const educationBlock = document.querySelector('.education__additional');
const workExpBlock = document.querySelector('.work-exp__content');

// Find the parent block for the work block title
const workExp = document.querySelector('.work-exp');

// Get the height of the education block title and the work block title
const addEducationTitleHeight = educationBlock.firstElementChild.clientHeight;
const workExpTitleHeight = workExp.firstElementChild.clientHeight;

function changeHeightChain(chain, elemParentRect, lastElemHeight, gap, initOffsetChain, modOffsetChain, currentHeightTitle, initHeightTitle) {
    if (currentHeightTitle > initHeightTitle) {
        chain.style.top = modOffsetChain + 'px';
        chain.style.height = elemParentRect.height - lastElemHeight - modOffsetChain + 'px';
    } else {
        chain.style.top = initOffsetChain + 'px';
        chain.style.height = elemParentRect.height - lastElemHeight - gap + 'px';
    }
}

function checkAndChangeHeightBlocks() {
    let coordsEducationBlock = educationBlock.getBoundingClientRect();
    let lastEducationChildHeight = educationBlock.lastElementChild.clientHeight;
    let currentEducationTitleHeight = educationBlock.firstElementChild.clientHeight;

    let coordsWorkExpBlock = workExpBlock.getBoundingClientRect();
    let lastWorkExpChildHeight = workExpBlock.lastElementChild.clientHeight;
    let currentWorkTitleHeight = workExp.firstElementChild.clientHeight;

    changeHeightChain(chainEducation,
        coordsEducationBlock,
        lastEducationChildHeight,
        gapChainEducation,
        initOffsetChainEducation,
        modOffsetChainEducation,
        currentEducationTitleHeight,
        addEducationTitleHeight);
    changeHeightChain(chainWork,
        coordsWorkExpBlock,
        lastWorkExpChildHeight,
        gapChainWork,
        initOffsetChainWork,
        modOffsetChainWork,
        currentWorkTitleHeight,
        workExpTitleHeight);

}

// Set initial and modified values
const gapChainEducation = 35;
const gapChainWork = 5;
const initOffsetChainEducation = 40;
const modOffsetChainEducation = 100;
const initOffsetChainWork = 10;
const modOffsetChainWork = 20;

window.addEventListener('resize', () => {
    checkAndChangeHeightBlocks();
});

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        checkAndChangeHeightBlocks();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    checkAndChangeHeightBlocks();
});


