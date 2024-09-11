//TO CREATE COOKIES
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");//this module is use to send cookies directly,
app.use(cookieParser("SecretCode"));

app.get("/getcookies",(req,res)=>{
  res.cookie("IronMan","i am TonyStark");//we can also add cookies mannually form consol
  res.cookie("greet","Namaste");
  res.cookie("love","I love myself",{signed:true});//this is a safe Signed cookie, also to make it safe we need to send a secret code in app.use(cookiePareser(here));
  res.send("sent you some singed cookies");
});

app.get("/",(req,res)=>{
  console.dir(req.cookies);//printing cookies from req directly is not possiable so we use cookies-phaser
  res.send("enjoy your meal ");
});

//let use the cookie as a paramiter
app.get("/greet",(req,res)=>{
  let {name = "Anonymous"} = req.cookies;
  res.send(`Hii , I am ${name}`);
});

//To verify Signed cookies
app.get("/verify",(req,res)=>{
  console.log(req.cookies);//it'll print unsigned cookies
  console.log(req.signedCookies);//it'll print signed cookies
  res.send("verified");
})

app.listen(3000,()=>{
  console.log("server is running on 3000");
});