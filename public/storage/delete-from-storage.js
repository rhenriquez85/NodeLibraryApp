//
const deleteForm = document.querySelector('.library-add-delete');

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (event.submitter.innerText === 'Add') return;

    deleteFromLibrary(deleteForm.elements['title'].value);
});

// HELPERS
function deleteFromLibrary(title, display = true) {
    const session = window.sessionStorage;
    const username = session.getItem('active_account');
    const database = session.getItem('database');

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

                display && displayDeleteMessage(name);
                updateIndexedDB();
            });
        }
    }
    else {
        const ids = convertLocalStorageToObj();
        const local = window.localStorage;
        let matchedName;

        Object.entries(ids).forEach(([id, book]) => {
            if (book.title === title) {
                local.removeItem(id);
                matchedName = book.title;
            }
        });

        display && displayDeleteMessage(matchedName);
        if (!matchedName) return;
    }

    setTimeout(() => {
        window.location = window.location;
    }, 1100);
}

function displayDeleteMessage(name) {
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