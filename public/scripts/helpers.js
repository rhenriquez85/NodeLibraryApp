function convertLocalStorageToObj() {
    const obj = {};
    const entries = Object.entries(window.localStorage);
    entries.forEach(([id, book]) => {
        const data = JSON.parse(book);
        if (!data.title) return;
        obj[id] = data;
    });
    return obj;
}

function convertToURL(path, parameters = {}) {
    let url = path;
    if (parameters != {}) {
        url += '?';
        Object.entries(parameters).forEach(([name, val], index, arr) => {
            url += `${name}=${val}&`
        });
        url = url.substring(1, url.length - 1);
    }
    return url;
}

function updateIndexedDB(callback) {
    if (window.sessionStorage.getItem('database') !== 'mySQL') return;

    const deleteRequest = indexedDB.deleteDatabase('store');

    deleteRequest.onsuccess = loadIndexedDB;
    loadIndexedDB();

    function loadIndexedDB() {

        const xhr = new XMLHttpRequest();
        const parameters = { username: window.sessionStorage.getItem('active_account')};
        const url = convertToURL('/mySQL-load-library', parameters);
        xhr.open('GET', url);
        xhr.send();

        xhr.addEventListener('load', () => {
            let openRequest = indexedDB.open('store', 1);

            openRequest.onerror = (err) => {
                console.log(err);
            };

            openRequest.onsuccess = () => {
                const db = openRequest.result;
                let transaction = db.transaction('books', 'readwrite');
                let books = transaction.objectStore('books');

                const data = JSON.parse(xhr.responseText);
                data.forEach((item, index, el) => {
                    console.log(item);
                    const book = {
                        title: item.Title,
                        author: item.Author,
                        genre: item.Genre,
                    }
                    books.add(book);
                });

                if (typeof callback === 'function') {
                    callback(db);
                }
                else {
                    db.close();
                }
            };
            
            openRequest.onupgradeneeded = () => {
                let db = openRequest.result;
                if (db.objectStoreNames.contains('books')) {
                    db.deleteObjectStore('books');
                }
                db.createObjectStore('books', {
                    keyPath: 'title',
                });
            };
        });
    }
}