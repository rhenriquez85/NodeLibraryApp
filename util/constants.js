const PAGES = {
    ABOUT: '/about',
    HOME: '/home',
    LIBRARY: '/library',
}

const PATHS = {
    ABOUT: './pages/about.html',
    HOME: './pages/home.html',
    LIBRARY: './pages/library.html',
    LOCAL_STORAGE: './public/storage/local-storage/add-to-local-storage.js',
    STYLES: './public/styles/styles.css',
    LOAD_LIBRARY: './public/scripts/load-library.js',
}

const RESOURCES = {
    STYLES: '/styles.css',
    LOCAL_STORAGE: '/add-to-local-storage.js',
    LOAD_LIBRARY: '/load-library.js',
}

const ROUTES = {
    ADD_TO_LIBRARY: '/add-to-library',
}

const ENTITIES = {
    BOOK: 'book',
}

const PROPERTIES = {
    BOOK: {
        TITLE: 'title',
        AUTHOR: 'author',
        GENRE: 'genre',
    }
}

module.exports = { PAGES, PATHS, RESOURCES, ROUTES, ENTITIES, PROPERTIES };