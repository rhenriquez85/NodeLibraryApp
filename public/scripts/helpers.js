function convertLocalStorageToObj() {
    const obj = {};
    const entries = Object.entries(window.localStorage);
    entries.forEach(([name, book]) => {
        obj[name] = JSON.parse(book);
    });
    return obj;
}