const PAGES = {
    ABOUT: '/about',
    HOME: '/home',
    LIBRARY: '/library',
}

const PATHS = {
    ABOUT: './pages/about.html',
    HOME: './pages/home.html',
    LIBRARY: './pages/library.html',
    // LOCAL_STORAGE: './public/storage/add-to-local-storage.js',
    LOCAL_STORAGE: './add-to-library.js',
    STYLES: './public/styles/styles.css',
}

const RESOURCES = {
    STYLES: '/styles.css',
    LOCAL_STORAGE: '/add-to-local-storage.js',
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

module.exports = { PAGES, PATHS, RESOURCES, ENTITIES, PROPERTIES };