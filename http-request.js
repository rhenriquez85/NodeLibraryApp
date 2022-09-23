const http = require('http');

console.log('Enter request:')
process.stdin.on('data', (data) => {
    const input = data.toString().trim();

    closeProgram(input);
    sendHTTPRequest(input);
    
    console.log('\nEnter request:')
});

// CALLBACKS
function sendHTTPRequest(input) {
    const params = input.split(' ');
    const [path, hostname = 'localhost', port = 3000, method = 'GET'] = params;
    console.log(`>...Request: '${path}' ${hostname} ${port} ${method}`);
    const options = {
        path,
        hostname,
        port,
        method,
    }
    http.request(options).end();
}

function closeProgram(input) {
    if (['x', 'exit'].includes(input)) 
        process.exit();
}


























// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// rl.question('Enter request: ', (data) => {
//     console.log(data);
//     // sendHTTPRequest(data);
//     // closeProgram(data);
//     rl.close();
// });
