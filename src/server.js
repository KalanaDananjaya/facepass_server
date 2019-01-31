var db = require ('./db_connection');
var mysql =require('mysql');
var express = require('express');
const bodyParser = require('body-parser');
const uuid = require ('uuid/v4');
const axios = require('axios');
var multer = require('multer');
var upload = multer ({ dest : 'uploads/'});
var FormData = require('form-data');



var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
app.post('/register',function(req,res){
    email=req.body.email;
    firstName = req.body.firstName;
    tp = req.body.tp;
    uid = uuid();
    /*There is a issue in adding telephone number*/
   /* 
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
*/
app.get('/register',function(req,res){
    console.log('hello');
});

app.get('/',function(req,res){/*
    axios.get('http://localhost:5000/')
    .then((response)=>{
        console.log(response);
        res.send(response.data);
    })
    .catch((err)=>{
        console.log(err);
    })*/
    console.log('request is');
    console.log(req);
    console.log('request body is');
    console.log(req.body);
    data = {"test" : "hell"}

    axios.post('http://localhost:5000/',data,{
        headers : {
            'Content-Type' : 'application/json'
        }
        
    })
    .then((response)=>{
        console.log('response recieved');
        console.log(response);
        //res.send(response.data);
    })
    .catch((error)=>{
        console.log('error recieved');
        console.error(error);
    })
    res.send(200);
});

app.post('/upload',upload.single('file'),function(req,response){
    
    console.log('recieved file');
    
    var fileName=req.file.filename; //processed name
    var originalName = req.file.originalname; //original name
    console.log(originalName)

    var data = {
        "filename":fileName,
        "originalname" : originalName
    }
    console.log ("data",data)
    
    axios.post('http://localhost:5000/test',data,{
        headers : {
            'Content-Type' : 'application/json'
        }
        
    })
    .then((res)=>{
        console.log("succeeded");
        console.log(res);
    })
    .catch((error)=>{
        console.log("failure");
        console.error(error);
    })
    
    response.send("success");
});



app.listen(3000);