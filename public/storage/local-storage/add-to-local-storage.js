//
const addForm = document.querySelector(".add-to-library");
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {};
    ['title', 'author', 'genre'].forEach((name) => {
        const property = addForm.elements[name];
        data[name] = property.value;
        property.value = '';
    });
    window.localStorage.setItem(data['title'], JSON.stringify(data));

    const html = `<p class="book-added"><em>${data['title']}</em> was added to the library!</p>`
    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    addForm.insertAdjacentHTML('afterend', html);
});





