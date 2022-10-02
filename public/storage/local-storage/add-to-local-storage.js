//
const addForm = document.querySelector(".library-add-delete");
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (event.submitter.innerText === 'Delete') return;

    const bookDetails = ['title', 'author', 'genre'];
    for (const detail of bookDetails) {
        if (addForm.elements[detail].value === '') {
            window.alert(`Please enter a ${detail}.`);
            return;
        }
    }

    const data = {};
    bookDetails.forEach((name) => {
        const property = addForm.elements[name];
        data[name] = property.value;
        property.value = '';
    });

    const title = data['title'];
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
        const ids = convertLocalStorageToObj();
        let bookToAdd = title;
        Object.entries(ids).forEach(([id, book]) => {
            if (book.title === title) {
                bookToAdd = null;
            }
        });

        displayAddMessage(bookToAdd);
        if (!bookToAdd) return;
        const local = window.localStorage;
        const id = +local.getItem('__highest') + 1;
        local.setItem('__highest', id);
        local.setItem(id, JSON.stringify(data));
    }

    setTimeout(() => {
        window.location.reload();
    }, 1500);
});

function displayAddMessage(name) {
    let html;
    if (name) {
        html = `<p class="book-added"><em>${name}</em> was added to the library!</p>`;
    }
    else {
        html = `<p class="book-deleted">Book already added.</p>`;
    }
    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    addForm.insertAdjacentHTML('afterend', html);
}