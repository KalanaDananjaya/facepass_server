var path = require('path');
var express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));
console.log( express.static(path.join(__dirname, 'public')));

const register = require('./routes/register.js');
const verify = require('./routes/verify.js');
const addaccount = require('./routes/addAccount.js');

app.use('/register',register);
app.use('/verify',verify);
app.use('/addaccount',addaccount);

var server = app.listen(3000);

module.exports = server;
