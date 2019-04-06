
require('dotenv').config();

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
var cors = require('cors');
const Cryptr = require('cryptr');


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


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
        console.log(response);
        var sql = "INSERT INTO faces (uid,face,vector) values(?,?,?)";
        var params = [uid,fileName,JSON.stringify(response.data)]; //response.data is the vector of the face

        sql = mysql.format(sql,params);
        
        //will need to increase innodb_log_file_size=32MB in mysql ini file
        db.query(sql,function(err,result){
        if (err){
            throw err;
        }
        else{
            console.log("face vector query succesfully updated");
            res.send(200);
        }
    });
        
    })
    .catch((error)=>{
        console.log('error recieved');
        console.error(error);
    })
    
});


app.post('/verify',upload.single('file'),async function(req,response){
    console.log('recieved file for comparison');
    var filename =req.file.filename; //obtain the file name of the uploaded file
    console.log(filename);
    

    let getUidFromEmail = async () => {
        console.log("getemail  called");

        var email = req.body.email;
        var sql = "SELECT uid from customer where email=?";
        var params =[email];
        sql = mysql.format(sql,params);
        console.log(sql);

        let results = await new Promise((resolve,reject)=>db.query(sql,(err,dbresult)=>{
            if(err){
                reject(err);
            }
            else{
                console.log("inside uid-email promise",dbresult);
                resolve(dbresult);
            }
        }));
        return results;
    }
        var dbRes = await getUidFromEmail();
        var uid = dbRes[0].uid;
        console.log("user id",uid);
    
    

    let getFaceFromUid = async () =>{
        console.log("getface uid called",uid);
        var sql = "SELECT vector from faces where uid=?";
        var params = [uid];
        sql = mysql.format(sql,params);

        let results = await new Promise((resolve,reject)=>db.query(sql,(err,dbresult)=>{
            if(err){
                reject(err);
            }
            else{
                console.log("inside uid-face promise");
                resolve(dbresult);
            }
        }));

        return results;
    }
    var dbRes = await getFaceFromUid();
   
    if(dbRes){
        console.log("face vector query succesfully recieved");
        face_vector=dbRes[0].vector;

        var data = {
            filename  : filename,
            face_vector : face_vector
        }
    
        axios.post('http://localhost:5000/verify',data,{
            headers : {
                'Content-Type' : 'application/json'
            }    
        })
        .then((res)=>{
            console.log("cos similarity is");
            console.log(res.data);
            let sql = "SELECT * from credentials where uid=?";
            let params = [uid];
            sql = mysql.format(sql,params);
            if(res.data<0.4){
                console.log("successsss");
                db.query(sql,function(err,result){
                    if (err){
                        throw err;
                    }
                    else{
                        if(result){
                            console.log('result available',result);
                            const cryptr = new Cryptr(process.env.encrypt_secret);

                            result.forEach(element => {
                                element.password = cryptr.decrypt(element.password);
                            });

                            console.log("decrypted",result);

                            let msg={
                                data:res.data,
                                credentials:result,
                                uid : uid
                            }
                            response.json(msg);
                        }
                        else{
                            let msg={
                                data:res.data,
                                credentials:"no result"
                            }
                            response.json(msg);
                        }
                        
                    }
                });
            }
            else{
                let msg={
                    data:res.data,
                    credentials:"face unverified"
                }
                response.json(msg);
            }
            
        })
        .catch((error)=>{
            console.log("failure");
            console.error(error);
        })
    }
    else{
        console.log("face result is empty");
    }

    
});





app.get('/',function(req,res){
   
    console.log('request revieced');
 
    res.send(200);
});


app.post('/upload',upload.single('file'),function(req,response){
    
    console.log('***************');
    console.log(req.body);
    console.log('***************');

    if(req.file){
        console.log(req.file);
    }
    
    axios.get('http://localhost:5000/',{
        
    });
    
    axios.post('http://localhost:5000/test',req,{
        headers : {
            'Content-Type' : 'application/json'
        }
        
    })
    .then((res)=>{
        console.log("succeeded");
    })
    .catch((error)=>{
        console.log("failure");
        console.error(error);
    })
    
    response.send("success");
});

app.post('/addaccount',async function(req,res){
    var website= req.body.website;
    var username=req.body.username;
    var password = req.body.password;
    var uid = req.body.uid;
    const cryptr = new Cryptr(process.env.encrypt_secret);
    password = cryptr.encrypt(password);

    console.log(req.body);
    
    
    var sql = "INSERT INTO credentials VALUES (?,?,?,?)";
    var params = [uid,website,username,password];
    sql = mysql.format(sql,params);
    console.log(sql);
    db.query(sql,function (err,result){
        if(err){
            throw err;
        }
        else{
            console.log("account details succesfully added");
            res.json("success");
        }
    })

    }); 


app.listen(3000);