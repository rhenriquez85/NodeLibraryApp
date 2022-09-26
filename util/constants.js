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
    LOCAL_STORAGE_DELETE: './public/storage/local-storage/delete-from-local-storage.js',
    STYLES: './public/styles/styles.css',
    LOAD_LIBRARY: './public/scripts/load-library.js',
    IMAGE_BOOK: './public/images/book.jpeg',
    HELPERS: './public/scripts/helpers.js',
    LOGIN: './public/scripts/login.js',
}

const IMAGES = {
    IMAGE_BOOK: '/book.jpeg',
}

const RESOURCES = {
    ...IMAGES,
    STYLES: '/styles.css',
    LOCAL_STORAGE: '/add-to-local-storage.js',
    LOCAL_STORAGE_DELETE: '/delete-from-local-storage.js',
    LOAD_LIBRARY: '/load-library.js',
    HELPERS: '/helpers.js',
    LOGIN: '/login.js',
}

const ROUTES = {
    ADD_TO_LIBRARY: '/add-to-library',
    DELETE_FROM_LIBRARY: '/delete-from-library',
    MYSQL_LOGIN: '/mySQL-login',
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