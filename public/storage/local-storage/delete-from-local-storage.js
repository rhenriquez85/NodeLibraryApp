//
const deleteForm = document.querySelector('.delete-from-library');

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const session = window.sessionStorage;
    const username = session.getItem('active_account');
    const database = session.getItem('database');
    const title = deleteForm.elements['title'].value;

    if (username) {
        if (database === 'mySQL') {
            const xhr = new XMLHttpRequest();
            const parameters = {
                username,
                database,
                title,
            };
            const url = convertToURL('/delete-from-library', parameters);
            xhr.open('POST', url);
            xhr.send();

            xhr.addEventListener('load', () => {
                const data = JSON.parse(xhr.responseText);

                let name;
                if (data['affectedRows']) {
                    name = title;
                }

                displayMessage(name);
                updateIndexedDB();
            });
        }
    }
    else {
        const books = convertLocalStorageToObj();
        let matchedName;
        Object.entries(books).forEach(([name, val], index, arr) => {
            if (name === title) {
                window.localStorage.removeItem(name);
                matchedName = name;
                return;
            }
            displayMessage(matchedName);
        });

    }

});

// HELPERS
function displayMessage(name) {
    let html;
    if (name) {
        html = `<p class="book-deleted"><em>${name}</em> was removed from the library!.</p>`;
    }
    else {
        html = `<p class="book-deleted">Book not found.</p>`
    }
    deleteForm.reset();
    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    deleteForm.insertAdjacentHTML('afterend', html);
}