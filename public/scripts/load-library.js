//
const books = convertLocalStorageToObj();
const child = document.createElement('div');

Object.values(books).forEach((obj, index, arr) => {
    let property = '';
    Object.entries(obj).forEach(([name, value], index, arr) => {
        property += `<br>${name}: ${value}`;
    });
    
    const child = document.createElement('div');
    child.innerHTML = '<img src="book.jpeg" alt="Image of book.">';
    child.innerHTML += property;
    document.querySelector('.library-container').appendChild(child);
});