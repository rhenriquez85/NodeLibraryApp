const http = require('http');

const options = {
    hostname: 'localhost',
    method: 'GET',
    path: '/exit',
    port: 3000,
    protocol: 'http:',
}
http.request(options).end();
