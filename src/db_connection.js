var mysql = require ('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host:process.env.db_host,
    user:process.env.db_user,
    password:process.env.db_password,
    database:process.env.db_database
});

connection.connect(function (err){
    if(err) {
        throw err;
    }
    else {
        console.log("Connected");
    }
});

module.exports = connection;