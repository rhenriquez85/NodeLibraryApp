const APP = {
    PORT: process.env.NODE_PORT || 3000,
};

const MYSQL = {
    HOST: process.env.MYSQL_HOST || 'localhost',
    USER: process.env.MYSQL_USER || 'root',
    PASSWORD: process.env.MYSQL_PASSWORD || 'password',
    DATABASE: process.env.MYSQL_DATABASE || 'sys',
};

module.exports = { APP, MYSQL };