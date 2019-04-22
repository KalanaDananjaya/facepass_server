const express = require('express');
const router = express.Router();
var db = require ('../db_connection');
var mysql =require('mysql');
const axios = require('axios');
const Cryptr = require('cryptr');
var multer = require('multer');
var upload = multer ({ dest : '../../uploads/'});

router.post('/',upload.single('file'),async(req,response)=>{

    //console.log('recieved file for comparison');
    var filename =req.file.filename; //obtain the file name of the uploaded file
    //console.log(filename);
    

    let getUidFromEmail = async () => {
        //console.log("getemail  called");

        var email = req.body.email;
        var sql = "SELECT uid from customer where email=?";
        var params =[email];
        sql = mysql.format(sql,params);
        //console.log(sql);

        let results = await new Promise((resolve,reject)=>db.query(sql,(err,dbresult)=>{
            if(err){
                //console.log("error");
                reject(err);
            }
            else{
                //console.log("inside uid-email promise",dbresult);
                resolve(dbresult);
            }
        }));
        return results;
    }
        var dbRes = await getUidFromEmail();
        var uid = dbRes[0].uid;
        //console.log("user id",uid);
    
    

    let getFaceFromUid = async () =>{
        //console.log("getface uid called",uid);
        var sql = "SELECT vector from faces where uid=?";
        var params = [uid];
        sql = mysql.format(sql,params);

        let results = await new Promise((resolve,reject)=>db.query(sql,(err,dbresult)=>{
            if(err){
                reject(err);
            }
            else{
                //console.log("inside uid-face promise");
                resolve(dbresult);
            }
        }));

        return results;
    }
    var dbRes = await getFaceFromUid();
   
    if(dbRes){
        //console.log("face vector query succesfully recieved");
        face_vector=dbRes[0].vector;

        var data = {
            filename  : filename,
            face_vector : face_vector
        }
        //console.log("filename is",data.filename);
        axios.post('http://localhost:5000/verify',data,{
            headers : {
                'Content-Type' : 'application/json'
            }    
        })
        .then((res)=>{
            //console.log("cos similarity is");
            //console.log(res.data);
            let sql = "SELECT * from credentials where uid=?";
            let params = [uid];
            sql = mysql.format(sql,params);
            if(res.data<0.4){
                //console.log("successsss");
                db.query(sql,function(err,result){
                    if (err){
                        let msg = {
                            data:err,
                            credentials:"no result"
                        }
                        response.json(msg);
                    }
                    else{
                        if(result){
                            //console.log('result available',result);
                            const cryptr = new Cryptr(process.env.encrypt_secret);

                            result.forEach(element => {
                                element.password = cryptr.decrypt(element.password);
                            });

                            //console.log("decrypted",result);

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
            //console.log("failure");
            console.error(error);
        })
    }
    else{
        console.log("face result is empty");
    }

    

});


module.exports = router;