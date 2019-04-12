require('dotenv').config();

const express = require('express');
const router = express.Router();
var db = require ('../db_connection');
var mysql =require('mysql');
const Cryptr = require('cryptr');



router.post('/',async(req,res)=>{
    var website= req.body.website;
    var username=req.body.username;
    var password = req.body.password;
    var uid = req.body.uid;
    const cryptr = new Cryptr(process.env.encrypt_secret);
    password = cryptr.encrypt(password);

    console.log(req.body);
    
    
    var sql = 'INSERT INTO credentials VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE uid=?,website=?,username=?,password=? ';
    var params = [uid,website,username,password,uid,website,username,password];
    sql = mysql.format(sql,params);
    console.log(sql);
    db.query(sql,function (err,result){
        if(err){
            let msg = {
                success : false,
                msg:err
            }
            res.json(msg);
        }
        else{
            console.log("account details succesfully added");
            let msg = {
                success : true,
                msg:"success"
            }
            res.json(msg);
        }
    });
});

module.exports = router;