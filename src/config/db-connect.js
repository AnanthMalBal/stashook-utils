const mysql = require('mysql2');
const cred = require('./cred');

const connection = mysql.createConnection(cred.db);
  
module.exports = connection;


