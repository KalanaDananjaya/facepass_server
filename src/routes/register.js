const express = require('express');
const router = express.Router();
const uuid = require ('uuid/v4');
const axios = require('axios');
var multer = require('multer'); 
var registerUpload =multer ({ dest : '../register/'});
var db = require ('../db_connection');
var mysql =require('mysql');
var path = require('path');

router.post('/',registerUpload.single('file'),(req,res)=>{
    console.log("register called");
    email=req.body.email;
    firstName = req.body.firstName;
    password = req.body.pass;
    uid = uuid();

    fileName = req.file.filename;
    
   
    var sql ="INSERT INTO customer (email,firstName,uid) values(?,?,?)";
    var params=[email,firstName,uid];
    sql = mysql.format(sql,params);
    
    db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            //console.log("customer query succesfully updated");
            ;
        }
    });

    /*send file name and uid to flask server to preprocess*/
    var data = {
        "filename":fileName,
    }
    //console.log ("data",data)

    axios.post('http://localhost:5000/preprocess',data,{
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then((response)=>{
        
        var sql = "INSERT INTO faces (uid,face,vector) values(?,?,?)";
        var params = [uid,fileName,JSON.stringify(response.data)]; //response.data is the vector of the face

        sql = mysql.format(sql,params);
        
        //will need to increase innodb_log_file_size=32MB in mysql ini file
        db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            //console.log("face vector query succesfully updated");
            console.log(path.join(__dirname + '../views/index.html'));
            res.sendFile(path.join(__dirname + '../views/index.html'));
        }
    });
        
    })
    .catch((error)=>{
        //console.log('error recieved');
        console.error(error);
    })
    
});

module.exports=router;
