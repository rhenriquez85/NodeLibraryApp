//
const session = window.sessionStorage;
const local = window.localStorage;

initLibrary();
showResetButton();

if (session.getItem('database') === 'mySQL') {
    updateIndexedDB((db) => {
        const transaction = db.transaction('books', 'readwrite');
        const objectStoreRequest = transaction.objectStore('books').getAll();

        objectStoreRequest.onsuccess = () => {
            const books = objectStoreRequest.result;
            loadLibrary(books);
            db.close();
        };
    });
}
else {
    const books = convertLocalStorageToObj();
    loadLibrary(books);
}

// HELPERS
function initLibrary() {
    if (!local.getItem('__visited')) {
        let id = local.getItem('__highest');
        [
            ['__visited', 'true'],
            [++id, '{"title":"A Hunger Artist","author":"Franz Kafka","genre":"Fiction"}'],
            [++id, '{"title":"As I Lay Dying","author":"William Faulkner","genre":"Fiction"}'],
            [++id, '{"title":"White Buildings","author":"Hart Crane","genre":"Poetry"}'],
            ['__highest', id],
        ].
        forEach(([key, value]) => {
            local.setItem(key, value);
        });
    }
}

function showResetButton() {
    const resetBtn = document.querySelector('.reset-library');
    resetBtn.style.display = session.getItem('active_account') ?
        'none' :
        'initial';
}

function loadLibrary(books) {
    const form = document.querySelector('.library-add-delete').parentElement;
    const library = document.querySelector('.library-container')
    library.innerHTML = '';

    Object.values(books).forEach((obj, index, arr) => {
        let property = '';
        Object.entries(obj).forEach(([name, value], index, arr) => {
            property += `<br><span title=${name}>${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}</span>`;
        });
        
        const child = document.createElement('div');
        child.innerHTML = '<img src="book.jpeg" alt="Image of book.">';
        child.innerHTML += property;
        library.appendChild(child);
    });

    library.appendChild(form);

    const childNodes = library.childNodes
    for (let i = 0; i < childNodes.length - 1; i++) {
        const node = childNodes[i];

        let title;
        node.childNodes.forEach((node, index, arr) => {
            if (node.title === 'title')
                title = node.innerText.substring('Title: '.length);
        });

        const deleteMsg = document.createElement('p');
        deleteMsg.className = 'close-button-deleted';
        deleteMsg.innerText = 'Deleted!';
        node.prepend(deleteMsg);

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerText = 'x';
        node.prepend(closeButton);

        closeButton.addEventListener('click', () => {
            deleteMsg.style.display = 'inline';
            deleteFromLibrary(title, false);
        });
    }
}