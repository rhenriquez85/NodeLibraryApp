const http = require('http');
const fs = require('fs');
const { addToLibrary, deleteFromLibrary } = require('./api/library/library');
const { mySQL_Login, mySQL_LoadLibrary, mySQL_AddUser } = require('./api/mySQL/mySQL');
const { convertURL } = require('./api/util/helpers');
const CONSTANTS = require('./util/constants');
const ENV = require('./util/env');

const server = http.createServer(requestListener);
server.listen(ENV.APP.PORT, () => {
    console.log('LISTENING...\n');
});

// EVENT HANDLERS
const sockets = [];
server.on('connection', (socket) => {
    console.log('>.........CONNECTION TO SERVER ESTABLISHED\n');

    sockets.push(socket);
    socket.on('data', (data) => {
        console.log(`...data received:\n${data}`);
    })
    socket.on('close', () => {
        console.log('>.........CONNECTION TO SERVER CLOSED\n');
    });
});

server.on('close', () => {
    console.log('!!!!!...SHUT DOWN SERVER...!!!!!\n');
    sockets.forEach((socket, index, arr) => {
        socket.destroy();
    });
});

server.on('request', (req, res) => {
    console.log('>...REQUEST TO SERVER\n');

    publicFolder(req, res);
    siteNav(req, res);
    registerRoutes(req, res);
})

server.on('error', (err) => {
    console.log(err);
});

// CALLBACKS: PUBLIC FOLDER
function publicFolder(req, res) {
    const url = req.url;
    if (url === CONSTANTS.RESOURCES.STYLES) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.STYLES, "UTF-8");
        res.writeHead(200, { "Content-Type": "text/css" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.HELPERS) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.HELPERS);
        res.writeHead(200, { "Content-Type": "text/javascript"})
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.STORAGE_ADD) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.STORAGE_ADD);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.STORAGE_DELETE) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.STORAGE_DELETE);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.INDEXED_DB) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.INDEXED_DB);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.LOAD_LIBRARY) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.LOAD_LIBRARY);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.LOGIN) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.LOGIN);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.IMAGE_BOOK) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.IMAGE_BOOK);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.ABOUT_MODAL) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.ABOUT_MODAL);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
}

// CALLBACKS: SITENAV
function siteNav(req, res) {
    const url = req.url;
    if (Object.values(CONSTANTS.PAGES).includes(url)) {
        const page = Object.entries(CONSTANTS.PAGES).find(([key, value]) => value === url)[0];
        fs.readFile(CONSTANTS.PATHS[page], (err, data) => {
            if (err) console.log(err);
            res.write(data.toString());
            res.end();
        });
    }
}

// CALLBACKS: REGISTER ROUTES
function registerRoutes(req, res) {
    addToLibrary(req, res);
    deleteFromLibrary(req, res);
    mySQL_Login(req, res);
    mySQL_LoadLibrary(req, res);
    mySQL_AddUser(req, res);
}

// CALLBACKS: REQUEST LISTENER
function requestListener(req, res) {
    const url = convertURL(req, res).pathname;
    if (Object.values(CONSTANTS.PAGES).includes(url) || 
        Object.values(CONSTANTS.RESOURCES).includes(url) ||
        Object.values(CONSTANTS.ROUTES).includes(url)) 
        return;

    res.write('Request\n');
    res.write(`url: ${url}`);
    res.end();
}