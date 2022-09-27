//
const session = window.sessionStorage;
showActiveAccount();
const mySQLLoginForm = document.querySelector('.mySQL-login-container form');

mySQLLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);

        if (response.username) {
            session.setItem('active_account', response.username);
            mySQLLoginForm.reset();
            showActiveAccount();
        }
        else {
            console.log('error: ' + response.error);
        }
    });

    let credentials = {};
    ['username', 'password'].forEach((el, index, arr) => {
        credentials[el] = mySQLLoginForm.elements[el].value;
    });

    const url = convertToURL('/mySQL-login', credentials);
    xhr.open('GET', url);
    xhr.send();
});

// HELPERS
function showActiveAccount() {
    if (!session.getItem('active_account')) return;
    const accountNode = document.querySelector('.login-name');
    accountNode.innerHTML = `Account: ${session.getItem('active_account')}`;
}