let mysql = require('mysql');
let Promise = require('bluebird');


module.exports = function () {
    const config = {
        host: process.env.mysql_db_host,
        user: process.env.mysql_db_user,
        password: process.env.mysql_db_password,
        database: process.env.mysql_db_name
    }

    let connection = mysql.createPool(config);
    connection = Promise.promisifyAll(connection);
    return connection;
}
