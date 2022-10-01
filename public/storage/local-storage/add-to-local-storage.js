//
const addForm = document.querySelector(".add-to-library");
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {};
    ['title', 'author', 'genre'].forEach((name) => {
        const property = addForm.elements[name];
        data[name] = property.value;
        property.value = '';
    });

    const title = data['title'];
    const html = `<p class="book-added"><em>${title}</em> was added to the library!</p>`
    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    addForm.insertAdjacentHTML('afterend', html);

    const session = window.sessionStorage;
    const username = session.getItem('active_account');
    const database = session.getItem('database');

    if (username) {
        if (database === 'mySQL') {
            const parameters = {
                username,
                database,
                ...data,
            };
            const url = convertToURL('/add-to-library', parameters);    

            xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.send();

            xhr.addEventListener('load', () => {
                updateIndexedDB();
            });
        }
    }
    else {
        const local = window.localStorage;
        const id = +local.getItem('__highest') + 1;
        local.setItem('__highest', id);
        local.setItem(id, JSON.stringify(data));
        local.setItem(data['title'], id);
    }
});





