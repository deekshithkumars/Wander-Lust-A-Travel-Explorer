const express=require('express');
const app=express();

app.listen(8080,(req,res)=>{
    console.log("server is listening to 8080 port");
})

app.get("/",(req,res)=>{
    res.send("route is working");
})