var envPath = __dirname + "/../.env"
console.log(envPath);
require('dotenv').config({path:envPath})

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;
const should = chai.should();
const server = require("../server");

chai.use(chaiHttp);

describe("Testing",function(){
  
  this.timeout(10000);
  
  it("/verify end point tested",(done)=>{
    chai.request(server)
      .post('/verify')
      .attach("file","/home/kalana_16/facepass_server/src/tests/test_images/positive.jpg")
      .field({ email : "kalana.16@cse.mrt.ac.lk"})
      .end((err,res)=>{
        res.should.have.status(200);
        expect(res.body.data).to.be.lt(0.4);
        expect(res.body).to.have.keys(['data','credentials','uid'])
        done();
      });  
  });

  
  it("/register end point tested",(done)=>{
    chai.request(server)
      .post('/register')
      .attach("file","/home/kalana_16/facepass_server/src/tests/test_images/positive.jpg")
      .field({
          firstName : "Test User",
          email : "test@gmail.com",
          password: "123456",
        })
      .end((err,res)=>{
        res.should.have.status(200);
        done();
      });
    }); 

    it("/addAccount end point tested",(done)=>{
      chai.request(server)
        .post('/addAccount')
        .send({
          website:"www.testwebsite.com/login",
          username:"test@gmail.com",
          password:"123456",
          uid:"fb07a6a3-60ad-4c0a-a24d-2dd66b7db00a"
        })
        .end((err,res)=>{
          res.should.have.status(200);
          expect(res.body.success).be.true;
          done();
        });
    });

    
  
  it("Should return 404 for any other end point",(done)=>{
    chai.request(server)
      .get('/random')
      .end((err,res)=>{
        res.should.have.status(404);
        done();
      });
  });

  });
   
