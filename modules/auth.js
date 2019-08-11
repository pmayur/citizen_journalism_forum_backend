let moment = require('moment');
let uniqid = require('uniqid');
var Promise = require("bluebird");
let bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));


exports.login = async function(email, password) {
    try {

        // check if email exists
        let query = `SELECT * FROM user WHERE email = ?`;
        let result = await mysql.queryAsync(query, [email]);
        if(result.length <= 0) {
            return "invalid_credentials"
        }

        let passMatched = await bcrypt.compareAsync(password, result[0].password);
        if (!passMatched) {
            return "invalid_credentials"
        }
        
        return result[0];
    } catch (e) {
        console.error(e);
        throw e;
    }
}

exports.signup = async function (email, password, name) {
    try {
        // Check if email exists
        let query = `SELECT * FROM user WHERE email = ?`;
        let result = await mysql.queryAsync(query, [email]);
        if(result.length > 0) {
            return "email_exists";
        }

        // encrypt pass
        let salt = await bcrypt.genSaltAsync(10);
        let hashPassword = await bcrypt.hashAsync(password, salt, null);

        // insert user
        query = 'INSERT INTO user (id, name, email, password, created_at) VALUES(?, ?, ?, ?, ?)';
        await mysql.queryAsync(query, [uniqid(), name, email, hashPassword, moment().toDate()]);
        
        return "user_created";
    } catch (e) {
        console.error(e);
        throw e;
    }
}