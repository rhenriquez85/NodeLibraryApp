//
const child = document.createElement('div');
const session = window.sessionStorage;

if (session.getItem('database') === 'mySQL') {
    console.log('mySQL');
}
else if (session.getItem('database') === 'mongoDB') {
    console.log('mongoDB')
}
else {
    const books = convertLocalStorageToObj();
    loadLibrary(books);
}

// HELPERS
function loadLibrary(books) {
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