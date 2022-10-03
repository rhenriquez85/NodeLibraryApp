//
const { connectToMySQL } = require('../mySQL/mySQL');
const { convertURL } = require('../util/helpers');
const CONSTANTS = require('../../util/constants');

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
                    console.log(result);

                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                    });
                    res.write('{"matched": "true"}');
                    res.end();
                }
                else {
                    query2 = `insert into Books values ("${title}", "${author}", "${genre}", "${user}")`;

                    const callback2 = (result) => {
                        console.log(result);
    
                        res.writeHead(201, {
                            'Content-Type': 'text/plain',
                        });
                        res.write(JSON.stringify(result));
                        res.end();
                    };
    
                    connectToMySQL(query2, callback2);
                }
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

module.exports = { addToLibrary, deleteFromLibrary };