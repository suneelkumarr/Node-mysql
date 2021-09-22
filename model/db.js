const mysql = require('mysql')
const dbconfig = require('../config/db.config')
const connection = mysql.createConnection({
    host:dbconfig.HOST,
    user: dbconfig.USER,
    password: dbconfig.PASSWORD,
    database: dbconfig.DB
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

  module.exports = connection