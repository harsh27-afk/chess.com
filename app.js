const express=require("express");
const socket=require("socket.io");
const http=require("http");
const {Chess}=require("chess.js");
const path=require("path")

const app=express();
const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();
let player={};
let currentPlayer="W";

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); // This is the line 
// that serves the static files in the public directory like CSS, JS, images, etc.


