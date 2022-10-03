//
const mysql = require('mysql');
const ENV = require('../../util/env');
const { convertURL } = require('../util/helpers');
const CONSTANTS = require('../../util/constants');

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

module.exports = { mySQL_Login, mySQL_LoadLibrary, mySQL_AddUser, connectToMySQL };