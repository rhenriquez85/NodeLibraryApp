//
const child = document.createElement('div');
const session = window.sessionStorage;

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
else if (session.getItem('database') === 'mongoDB') {
    console.log('mongoDB');
}
else {
    const books = convertLocalStorageToObj();
    loadLibrary(books);
}

// HELPERS
function loadLibrary(books) {
    document.querySelector('.library-container').innerHTML = '';

    Object.values(books).forEach((obj, index, arr) => {
        let property = '';
        Object.entries(obj).forEach(([name, value], index, arr) => {
            property += `<br>${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}`;
        });
        
        const child = document.createElement('div');
        child.innerHTML = '<img src="book.jpeg" alt="Image of book.">';
        child.innerHTML += property;
        document.querySelector('.library-container').appendChild(child);
    });
}