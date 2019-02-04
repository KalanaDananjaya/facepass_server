var db = require ('./db_connection');
var mysql =require('mysql');
var express = require('express');
const bodyParser = require('body-parser');
const uuid = require ('uuid/v4');
const axios = require('axios');
var multer = require('multer');
var upload = multer ({ dest : 'uploads/'});
var registerUpload =multer ({ dest : 'register/'});
var FormData = require('form-data');



var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/register',registerUpload.single('file'),function(req,res){
    console.log("register called");
    email=req.body.email;
    firstName = req.body.firstName;
    tp = req.body.tp;
    uid = uuid();

    fileName = req.file.filename;
    /*There is a issue in adding telephone number*/
   
    var sql ="INSERT INTO customer (email,firstName,uid) values(?,?,?)";
    var params=[email,firstName,uid];
    sql = mysql.format(sql,params);
    //console.log(sql);
    db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            console.log("customer query succesfully updated");
        }
    });

    /*send file name and uid to flask server to preprocess*/
    var data = {
        "filename":fileName,
    }
    console.log ("data",data)

    axios.post('http://localhost:5000/preprocess',data,{
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then((response)=>{
        console.log('******************555555555************************');
        console.log(response.data);
        console.log('********************55555*********************************');
        
        
        var sql = "INSERT INTO faces (uid,vector) values(?,?)";
        var params = [uid,response.data];

        sql = mysql.format(sql,params);
        //Need to fix the error when uploading vector to mysql
        db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            console.log("face vector query succesfully updated");
        }
    });
        
    })
    .catch((error)=>{
        console.log('error recieved');
        console.error(error);
    })
    
});


app.get('/',function(req,res){
   
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