const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const CONSTANTS = require('./util/constants');
const { resourceLimits } = require('worker_threads');

const server = http.createServer(requestListener);
server.listen(3000, () => {
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

    closeServer(req, res);
    publicFolder(req, res);
    siteNav(req, res);
    registerRoutes(req, res);
})

// CALLBACKS
function closeServer(req, res) {
    const url = req.url;
    if (url === '/exit') {
        console.log('...Request to shutdown server\n');
        server.close();
    }
}

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
    if (url === CONSTANTS.RESOURCES.LOCAL_STORAGE) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.LOCAL_STORAGE);
        res.writeHead(200, { "Content-Type": "text/javascript" });
        stream.pipe(res);
    }
    if (url === CONSTANTS.RESOURCES.LOCAL_STORAGE_DELETE) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.LOCAL_STORAGE_DELETE);
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
}

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

function registerRoutes(req, res) {
    addToLibrary(req, res);
    deleteFromLibrary(req, res);
    mySQL_Login(req, res);
    mySQL_LoadLibrary(req, res);
}

// CALLBACKS: LIBRARY
function addToLibrary(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.ADD_TO_LIBRARY) {
        // for (const [item, val] of url.searchParams.entries()) {
        //     // window.localStorage.setItem(item, val);
        // }
        res.writeHead(302, {
            'Location': CONSTANTS.PAGES.HOME,
        });
        res.end();
    }
}

function deleteFromLibrary(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.DELETE_FROM_LIBRARY) {
        // for (const [item, val] of url.searchParams.entries()) {
        //     // window.localStorage.setItem(item, val);
        // }
        res.writeHead(302, {
            'Location': CONSTANTS.PAGES.HOME,
        });
        res.end();
    }
}

// CALLBACKS: LOGIN
function mySQL_Login(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.MYSQL_LOGIN) {
        const query = 'select * from Users';
        const callback = (result) => {
            let response = {};
            result.forEach((data, index, arr) => {
                if (data.Username === url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME)) {
                    if (data.Password === url.searchParams.get(CONSTANTS.PROPERTIES.USER.PASSWORD)) {
                        return response[CONSTANTS.PROPERTIES.USER.USERNAME] = data.Username;
                    }
                    else {
                        return response[CONSTANTS.ENTITIES.ERROR] = CONSTANTS.ERRORS.USER.WRONG_PASSWORD;
                    }
                }
            });

            if (Object.keys(response).length === 0) {
                response[CONSTANTS.ENTITIES.ERROR] = CONSTANTS.ERRORS.USER.CREATE_NEW_USER;
            }

            res.writeHead(200, { 'Content-Type': "text/plain" });
            res.write(JSON.stringify(response));
            res.end();
        }

        connectToMySQL(query, callback);
    }
}

function mySQL_LoadLibrary(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.MYSQL_LOAD_LIBRARY) {
        const query = `select * from Books where User = "${url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME)}"`;
        callback = (result) => {
                res.writeHead(200, { "Content-Type": "text/plain"});
                res.write(JSON.stringify(result));
                res.end();
        };
        connectToMySQL(query, callback);
    }
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

// HELPERS
function convertURL(req, res) {
    return new URL('http://' + req.headers.host + req.url);
}

function connectToMySQL(query, callback) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'sys',
    });

    con.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }

        con.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(result);
        });
    });
}