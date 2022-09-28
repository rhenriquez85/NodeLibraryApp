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
            session.setItem('database', 'mySQL');
            mySQLLoginForm.reset();
            showActiveAccount();
            window.alert('You logged into your account!');
            activateModal(false);
        }
        else {
            const err = response.error;
            if (err === 'wrong_password') {
                window.alert('You entered a wrong password.');
            }
            else if (err === 'create_new_user') {
                const answer = window.confirm('Do you want to create a new account?');
                if (answer) {

                }
            }
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