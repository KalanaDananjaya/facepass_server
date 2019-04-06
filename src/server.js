
var express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const register = require('./routes/register.js');
const verify = require('./routes/verify.js');
const addaccount = require('./routes/addAccount.js');

app.use('/register',register);
app.use('/verify',verify);
app.use('/addaccount',addaccount);

app.listen(3000);