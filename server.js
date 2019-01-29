var db = require ('./db_connection');
var mysql =require('mysql');
var express = require('express');
const bodyParser = require('body-parser');
const uuid = require ('uuid/v4');
var app = express();

app.use(bodyParser.json());


app.post('/register',function(req,res){
    email=req.body.email;
    firstName = req.body.firstName;
    tp = req.body.tp;
    uid = uuid();
    /*There is a issue in adding telephone number*/
    
    var sql ="INSERT INTO customer (email,firstName,uid) values(?,?,?)";
    var params=[email,firstName,uid];
    sql = mysql.format(sql,params);
    console.log(sql);
    db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            console.log(result);
        }
    });
    res.send('<p>success</p>')
});

app.get('/register',function(req,res){
    console.log('hello');
});

app.get('/',function(req,res){
    console.log('test');
    res.send(true);
});



app.listen(3000);