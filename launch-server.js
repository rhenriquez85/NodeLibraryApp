const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
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
    if (url === CONSTANTS.RESOURCES.ABOUT_MODAL) {
        const stream = fs.createReadStream(CONSTANTS.PATHS.ABOUT_MODAL);
        res.writeHead(200, { "Content-Type": "text/javascript" });
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
    mySQL_AddUser(req, res);
}

// CALLBACKS: LIBRARY
function addToLibrary(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.ADD_TO_LIBRARY) {
        const database = url.searchParams.get(CONSTANTS.PROPERTIES.USER.DATABASE);
        const user = url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME);
        const title = url.searchParams.get(CONSTANTS.PROPERTIES.BOOK.TITLE);
        const author = url.searchParams.get(CONSTANTS.PROPERTIES.BOOK.AUTHOR);
        const genre = url.searchParams.get(CONSTANTS.PROPERTIES.BOOK.GENRE);

        if (database === 'mySQL') {
            const query = `select count(Title) from Books where Title = "${title}" and User = "${user}"`;
            const callback = (result) => {

                let query2;
                if (result[0]['count(Title)']) {
                    query2 = `update Books set Author = "${author}", Genre = "${genre}" where Title = "${title}" and User = "${user}"`;
                }
                else {
                    query2 = `insert into Books values ("${title}", "${author}", "${genre}", "${user}")`;
                }
                const callback2 = (result) => {
                    console.log(result);

                    res.writeHead(201, {
                        'Content-Type': 'text/plain',
                    });
                    res.end();
                };
                connectToMySQL(query2, callback2);
            };

            connectToMySQL(query, callback);
        }
    }
}

function deleteFromLibrary(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.DELETE_FROM_LIBRARY) {
        const database = url.searchParams.get(CONSTANTS.PROPERTIES.USER.DATABASE);
        const user = url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME);
        const title = url.searchParams.get(CONSTANTS.PROPERTIES.BOOK.TITLE);

        if (database === 'mySQL') {
            const query = `delete from Books where User = "${user}" and Title = "${title}"`;
            console.log(query);
            const callback = (result) => {
                console.log(result);

                res.writeHead(201, {
                    "Content-Type": "text/plain",
                })
                res.write(JSON.stringify(result));
                res.end()
            };
            connectToMySQL(query, callback);
        }
    }
}

// CALLBACKS: LOGIN
function mySQL_Login(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.MYSQL_LOGIN) {
        const query = 'select * from Users';
        const callback = (result) => {
            let response = {};
            const username = url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME);
            const password = url.searchParams.get(CONSTANTS.PROPERTIES.USER.PASSWORD);

            result.forEach((data, index, arr) => {
                if (data.Username === username) {
                    if (data.Password === password) {
                        return response[CONSTANTS.PROPERTIES.USER.USERNAME] = data.Username;
                    }
                    else {
                        return response[CONSTANTS.ENTITIES.ERROR] = CONSTANTS.ERRORS.USER.WRONG_PASSWORD;
                    }
                }
            });

            if (Object.keys(response).length === 0) {
                response[CONSTANTS.ENTITIES.ERROR] = CONSTANTS.ERRORS.USER.CREATE_NEW_USER;
                response[CONSTANTS.PROPERTIES.USER.USERNAME] = username;
                response[CONSTANTS.PROPERTIES.USER.PASSWORD] = password;
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

function mySQL_AddUser(req, res) {
    const url = convertURL(req, res);
    if (url.pathname === CONSTANTS.ROUTES.MYSQL_ADD_USER) {
        const username = url.searchParams.get(CONSTANTS.PROPERTIES.USER.USERNAME);
        const password = url.searchParams.get(CONSTANTS.PROPERTIES.USER.PASSWORD);
        const query = `insert into Users values("${username}", "${password}")`;
        callback = (result) => {
            const response = {
                result,
                username,
            }
            res.writeHead(201, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(response));
            res.end();
        }
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
        host: ENV.MYSQL.HOST,
        user: ENV.MYSQL.USER,
        password: ENV.MYSQL.PASSWORD,
        database: ENV.MYSQL.DATABASE,
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