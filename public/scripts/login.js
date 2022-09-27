//
const mySQLLoginForm = document.querySelector('.mySQL-login-container form');

mySQLLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let credentials = {};
    ['username', 'password'].forEach((el, index, arr) => {
        credentials[el] = mySQLLoginForm.elements[el].value;
    });

    console.log(3333333333);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (event) => {
        console.log(22222);

        console.log(event);

        console.log(xhr.responseText);

    });

    // xhr.onreadystatechange = () => {
    //     console.log(xhr.responseText);
    // };

    const url = convertToURL('/mySQL-login', credentials);
    xhr.open('GET', url);
    xhr.send();
});