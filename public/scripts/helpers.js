function convertLocalStorageToObj() {
    const obj = {};
    const entries = Object.entries(window.localStorage);
    entries.forEach(([name, book]) => {
        obj[name] = JSON.parse(book);
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