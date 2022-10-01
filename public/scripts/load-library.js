//
const child = document.createElement('div');
const session = window.sessionStorage;
const local = window.localStorage;

if (!local.getItem('__visited')) {
    let id = local.getItem('__highest');
    [
        ['__visited', 'true'],
        ['A Hunger Artist', ++id],
        [id, '{"title":"A Hunger Artist","author":"Franz Kafka","genre":"Fiction"}'],
        ['As I Lay Dying', ++id],
        [id, '{"title":"As I Lay Dying","author":"William Faulkner","genre":"Fiction"}'],
        ['White Buildings', ++id],
        [id, '{"title":"White Buildings","author":"Hart Crane","genre":"Poetry"}'],
        ['__highest', id],
    ].
    forEach(([key, value]) => {
        local.setItem(key, value);
    });
}

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