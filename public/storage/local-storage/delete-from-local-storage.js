//
const deleteForm = document.querySelector('.delete-from-library');

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = deleteForm.elements['title'].value;
    const books = convertLocalStorageToObj();
    let html;

    Object.entries(books).forEach(([name, val], index, arr) => {
        if (name === title) {
            window.localStorage.removeItem(name);
            deleteForm.reset();
            html = `<p class="book-deleted"><em>${name}</em> was removed from the library!.</p>`;
            return;
        }
    });
    if (!html)
        html = `<p class="book-deleted">Book not found.</p>`

    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    deleteForm.insertAdjacentHTML('afterend', html);
});