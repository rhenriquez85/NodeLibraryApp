//
if (!session.getItem('active_account')) {
    indexedDB.deleteDatabase('store');
}

const observer = new MutationObserver(callback);
observer.observe(document.querySelector('.login-name'), { 
    childList: true,
});

function callback() {
    if (session.getItem('database') !== 'mySQL') return;

    indexedDB.deleteDatabase('store');
    console.log(11111);

    const xhr = new XMLHttpRequest();
    const parameters = { username: session.getItem('active_account')};
    const url = convertToURL('/mySQL-load-library', parameters);
    xhr.open('GET', url);
    xhr.send();

    xhr.addEventListener('load', () => {
        let openRequest = indexedDB.open('store', 1);

        openRequest.onerror = (err) => {
            console.log(err);
        };

        console.log(222222);
        
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
        };
        
        openRequest.onupgradeneeded = () => {
            let db = openRequest.result;
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', {
                    keyPath: 'title',
                });
            }
        };
    });
}