var mysql = require ('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host:'remotemysql.com',
    user:'aw0heiKQHd',
    password:'dYGtKwJbTP',
    database:'aw0heiKQHd'
});

connection.connect(function (err){
console.log(connection.host,connection.user,connection.password,connection.database);

    if(err) {
        throw err;
    }
    else {
        console.log("Connected");
    }
});

module.exports = connection;
