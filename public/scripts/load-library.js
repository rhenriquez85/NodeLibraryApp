//
const child = document.createElement('div');
const session = window.sessionStorage;
const local = window.localStorage;

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
    const library = document.querySelector('.library-container')
    library.innerHTML = '';

    Object.values(books).forEach((obj, index, arr) => {
        let property = '';
        Object.entries(obj).forEach(([name, value], index, arr) => {
            property += `<br>${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}`;
        });
        
        const child = document.createElement('div');
        child.innerHTML = '<img src="book.jpeg" alt="Image of book.">';
        child.innerHTML += property;
        library.appendChild(child);
    });

    const child = document.createElement('div');
    child.innerHTML = `
        <form class="library-add-delete">
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" name="title">
            </div>
            <div>
                <label for="author">Author:</label>
                <input type="text" id="author" name="author">   
            </div>
            <div>
                <label for="genre">Genre:</label>
                <select type="text" id="genre" name="genre">
                    <option value=""></option>
                    <option value="Ficton">Fiction</option>
                    <option value="Poetry">Poetry</option>
                    <option value="History">History</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Economics">Economics</option>
                    <option value="Politics">Politics</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <button type="submit">Add</button>
                <button type="submit">Delete</button>
            </div>
        </form>
    `;
    library.appendChild(child);

    const childNodes = library.childNodes
    for (let i = 0; i < childNodes.length - 1; i++) {
        const node = childNodes[i];

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
            setTimeout(() => {
                deleteMsg.style.display = 'initial';
                
                window.location = window.location
            }, 1200);
        });
    }
}