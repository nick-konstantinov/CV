function getCountYearsOfExperience(dateString) {
    const today = new Date();
    const startDate = new Date(dateString);

    let months = (today.getFullYear() - startDate.getFullYear()) * 12 + today.getMonth() - startDate.getMonth();

    if (today.getDate() < startDate.getDate()) {
        months++;
    }

    const countYears = Math.floor(months / 12);

    return months % 12 < 5 ? countYears : countYears + '.5';
}

const START_DATES = {
    html: '2022-03-01',
    css: '2022-03-01',
    js: '2022-11-01',
    ts: '2023-11-01',
    angular: '2023-12-01',
    webpack: '2023-07-01',
    git: '2023-01-01',
    ps: '2022-04-01'
}

const expElemsIds = [
    '#html',
    '#css',
    '#js',
    '#ts',
    '#angular',
    '#webpack',
    '#git',
    '#ps'
];

// Get all elements with data-lang attribute period of experience
const expElems = [];
expElemsIds.forEach(id => {
    expElems.push(document.querySelector(id));
});

// Change count experience years
expElems.forEach(item => {
    item.innerHTML = getCountYearsOfExperience(START_DATES[item.id]);
})
