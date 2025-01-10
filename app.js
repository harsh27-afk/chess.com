const express=require("express");
const socket=require("socket.io");
const http=require("http");
const {Chess}=require("chess.js");
const path=require("path");
const { log } = require("console");

const app=express();
const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();
let players={};
let currentPlayer="w";

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); // This is the line 
// that serves the static files in the public directory like CSS, JS, images, etc.

app.get("/",(req,res)=>{
    res.render("index",{title:"Chess Game"})
})

io.on("connection",(uniqueSocket)=>{
    console.log(`New connection: ${uniqueSocket.id}`);

    if(!players.white){
        players.white=uniqueSocket.id;
        uniqueSocket.emit("playerRole","w");
    
       }
    else if(!players.black){
        players.black=uniqueSocket.id;
        uniqueSocket.emit("playerRole","b");
    }
    else{
        uniqueSocket.emit("spectatorRole");
    }

    uniqueSocket.on("disconnect",()=>{
        if(players.white===uniqueSocket.id){
            delete players.white;
        }
        else if(players.black===uniqueSocket.id){
            delete players.black;
        }
    })

    uniqueSocket.on("move",(move)=>{
       try{
         if(chess.turn()==="w"&& uniqueSocket.id!=players.white) return;
         if(chess.turn()==="b"&& uniqueSocket.id!=players.black) return;

         const result=chess.move(move);
         if(result){
            currentPlayer=chess.turn();
            io.emit("move",move);
            io.emit("boardState",chess.fen());
            // fen is a long string that represents the current state of the board
         }
         else{
            console.log("Invalid move",move);
            uniqueSocket.emit("invalid Move: ",move);
         }

       }catch(err){
              console.log(err);
              uniqueSocket.emit("invalid Move: ",move);
       }
    })
     
})

server.listen(5000,()=>{
    console.log(`server listening on port 5000`)
})
