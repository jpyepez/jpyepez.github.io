
const headers = Array.from(document.querySelectorAll('section > header'));
const mainSections = Array.from(document.querySelectorAll('.main-section'));
const navList = document.querySelector('#navbar > ul');

console.log(mainSections);
headers.forEach((header, idx) => {
    const sectionId = header.innerText.replace(new RegExp(" ", "g"), '_');
    mainSections[idx].id = sectionId;
    navList.insertAdjacentHTML('beforeend', `<a class="nav-link" href="#${sectionId}" rel="internal"><li>${header.innerText}</li></a>`);
})