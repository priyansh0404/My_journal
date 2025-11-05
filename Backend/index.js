import express from "express";
import 'dotenv/config';
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"
const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());
app.post("/add-entry",verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  
  if (result) {
    resp.status(200).json({ success: true, id: result.insertedId });
  } else {
    resp.status(500).json({ success: false });
  }
});

app.get("/entries",verifyJWTToken, async (req, resp) => {
  const db = await connection();
  // console.log("cookie test",req.cookies['token']);
  const collection = await db.collection(collectionName);
  const result = await collection.find().toArray();
  
  if (result) {
    resp.status(200).json({ success: true, result: result });
  } else {
    resp.status(500).json({ success: false });
  }
});


app.delete("/delete/:id",verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const id = req.params.id;
  const collection = await db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result) {
    resp
      .status(200)
      .json({ success: true, result: result, message: "Task deleted" });
  } else {
    resp.status(500).json({ success: false, message: "Task not deleted" });
  }
}); 

app.get("/entry/:id",verifyJWTToken, async (req, resp) => {
  const id = req.params.id;
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(id) });
  
  if (result) {
    resp.status(200).json({ success: true, result: result });
  } else {
    resp.status(500).json({ success: false });
  }
});

app.put("/update-entry",verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const { _id, ...fields } = req.body;
  const update = { $set: fields };
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
  if (result) {
    resp.status(200).json({ success: true, message: "Entry updated" });
  } else {
    resp.status(500).json({ success: false });
  }
});

app.post("/signup", async (req, resp) => {
  const userData = req.body;
  if (userData.name && userData.email && userData.password) {
    const db = await connection();
    const collection = db.collection("users");
    const result = await collection.insertOne(userData);
    if (result) {
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({
          success: true,
          msg: "User signedup",
          token,
        });
      });
    }
  } else {
    resp.send({
      success: false,
      msg: "Signup failed",
    });
  }
});

app.post("/login", async (req, resp) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = db.collection("users");
    const result = await collection.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (result) {
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({
          success: true,
          msg: "User login",
          token,
        });
      });
    }
    else{
        resp.send({
      success: false,
      msg: "user not found",
    });
    }
  } else {
    resp.send({
      success: false,
      msg: "Login failed",
    });
  }
});

app.get("/", (req, resp) => {
  resp.send({
    message: "Welcome to Api",
    success: true,
  });
});

function verifyJWTToken(req,resp,next){
  console.log("verify jwt token",req.cookies['token']);
  const token = req.cookies['token'] ;
  jwt.verify(token , 'Google' ,(err,decoded)=>{
    if(err){
      return resp.send({
        msg:"invalid token",
        success : false,
      });
    }
    console.log(decoded);
    next()
   
  })
}
app.listen(process.env.PORT);
