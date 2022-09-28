//
const modalLink = document.querySelector('.mySQL-modal-link');

modalLink.addEventListener('click', (event) => {
    event.stopPropagation();
    activateModal(true);

    const modal = document.querySelector('.mySQL-login-container');
    modal.style.visibility = 'visible';

    const backgroundEl = document.querySelectorAll('.blur-inactive');
    backgroundEl.forEach((el, index, arr) => {
        el.classList.add('blur-active');
        el.classList.add('blur-inactive');
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest(".mySQL-login-container")) {
        activateModal(false);
        document.querySelector('.mySQL-login-container form').reset();
    }
});

// HELPER
function activateModal(turnOn) {
    const modal = document.querySelector('.mySQL-login-container');
    modal.style.visibility = turnOn ? 'visible' : 'hidden';

    const addClass = turnOn ? 'blur-active' : 'blur-inactive';
    const removeClass = turnOn ? 'blur-inactive' : 'blur-active';

    const backgroundEl = document.querySelectorAll('.' + removeClass);
    backgroundEl.forEach((el, index, arr) => {
        el.classList.add(addClass);
        el.classList.remove(removeClass);
    });
}