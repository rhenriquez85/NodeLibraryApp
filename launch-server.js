const http = require('http');
const fs = require('fs');
const CONSTANTS = require('./util/constants');

const server = http.createServer(requestListener);
server.listen(3000, () => {
    console.log('LISTENING...\n');
});

// EVENT HANDLERS
const sockets = [];
server.on('connection', (socket) => {
    console.log('>.........CONNECTION TO SERVER ESTABLISHED\n');

    sockets.push(socket);
    // socket.on('data', (data) => {
    //     console.log(`...data received:\n${data}`);
    // })
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
    siteNav(req, res);
    publicFolder(req, res);
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
    console.log(url);
    console.log(CONSTANTS.RESOURCES.STYLES);
    if (url === CONSTANTS.RESOURCES.STYLES) {
        console.log(1111111111)
        const stream = fs.createReadStream(CONSTANTS.PATHS.STYLES, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        stream.pipe(res);
        // fs.readFile(CONSTANTS.PATHS.STYLES, (err, data) => {
        //     console.log('11>>>>');
        //     // console.log(data.toString());
        //     res.writeHead(200);
        //     res.end(data.toString());
        // });
    }
}

function siteNav(req, res) {
    const url = req.url;
    if (Object.values(CONSTANTS.PAGES).includes(url)) {
        const page = Object.entries(CONSTANTS.PAGES).find(([key, value]) => value === url)[0];
        fs.readFile(CONSTANTS.PATHS[page], (err, data) => {
            if (err) console.log(err);
            //
            res.writeHead(200, {"Content-Type": "text/html"});
            //
            res.write(data.toString());
            res.end();
        });
    }
}

function requestListener(req, res) {
    // publicFolder(req, res);
    // siteNav(req, res);



    const url = req.url
    if (Object.values(CONSTANTS.PAGES).includes(url)) return;

    console.log(url);
        
    // res.write('Request\n');
    // res.write(`url: ${url}`);
    // res.end();
}
