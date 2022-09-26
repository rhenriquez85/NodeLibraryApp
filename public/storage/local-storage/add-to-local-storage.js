//
const form = document.querySelector(".add-to-library");
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {};
    ['title', 'author', 'genre'].forEach((name) => {
        const property = form.elements[name];
        data[name] = property.value;
        property.value = '';
    });
    window.localStorage.setItem(data['title'], JSON.stringify(data));
});





