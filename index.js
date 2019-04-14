
// HTML elements
const navLinks =  document.querySelectorAll(".nav-link");
const projects = document.getElementById('projects')

// funtions and variables
let currentSection = 0;

const clearActive = () => {
    for (link of navLinks) {
        link.parentElement.classList.remove('active');
    }
}

const setActive = el => {
    clearActive();
    el.target.parentElement.classList.add('active');
}

const checkSection = () => {
    if( (window.scrollY + 60) < window.innerHeight) {
        currentSection = 0;
    } else if(window.scrollY >= window.innerHeight + projects.scrollHeight) {
        currentSection = 2;
    } else if( window.scrollY >= window.innerHeight) {
        currentSection = 1;
    }
    clearActive();
    navLinks[currentSection].parentElement.classList.add('active');
}


// nav bar listeners
for( link of navLinks) {
    link.addEventListener("click", setActive);
}

// check current section on scroll
window.addEventListener("scroll", checkSection);