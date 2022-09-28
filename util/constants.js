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
    INDEXED_DB: './public/storage/indexedDB/use-indexedDB.js',
    STYLES: './public/styles/styles.css',
    LOAD_LIBRARY: './public/scripts/load-library.js',
    IMAGE_BOOK: './public/images/book.jpeg',
    HELPERS: './public/scripts/helpers.js',
    LOGIN: './public/scripts/login.js',
    ABOUT_MODAL: './public/scripts/about-modal.js',
}

const IMAGES = {
    IMAGE_BOOK: '/book.jpeg',
}

const RESOURCES = {
    ...IMAGES,
    STYLES: '/styles.css',
    LOCAL_STORAGE: '/add-to-local-storage.js',
    LOCAL_STORAGE_DELETE: '/delete-from-local-storage.js',
    INDEXED_DB: '/use-indexedDB.js',
    LOAD_LIBRARY: '/load-library.js',
    HELPERS: '/helpers.js',
    LOGIN: '/login.js',
    ABOUT_MODAL: '/about-modal.js',
}

const ROUTES = {
    ADD_TO_LIBRARY: '/add-to-library',
    DELETE_FROM_LIBRARY: '/delete-from-library',
    MYSQL_LOGIN: '/mySQL-login',
    MYSQL_LOAD_LIBRARY: '/mySQL-load-library',
}

const ENTITIES = {
    BOOK: 'book',
    USER: 'user',
    ERROR: 'error',
}

const PROPERTIES = {
    BOOK: {
        TITLE: 'title',
        AUTHOR: 'author',
        GENRE: 'genre',
        USER: 'user',
    },
    USER: {
        USERNAME: 'username',
        PASSWORD: 'password',
        DATABASE: 'database',
    }
}

const ERRORS = {
    USER: {
        WRONG_PASSWORD: 'wrong_password',
        CREATE_NEW_USER: 'create_new_user',
    }
}

module.exports = { PAGES, PATHS, RESOURCES, ROUTES, ENTITIES, PROPERTIES, ERRORS };