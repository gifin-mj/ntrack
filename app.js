const express =require('express')
const http =require('http')
const path = require('path')
const socketio=require('socket.io')


const app=express()
const server=http.createServer(app)
const io=socketio(server)

app.set('view engine',"ejs")

app.use(express.static(path.join(__dirname,"public")))
io.on('connection',(socket)=>{
        socket.on('send-location',(data)=>{
            //const {latitude,longitude}=data
            console.log(socket.id,data)
            io.emit('receive-location',{id:socket.id, ...data})
        })
        socket.on('disconnect',()=>{
            io.emit('user-disconnected',socket.id)
        })
    console.log("connected");
    
})
app.get('/',(req,res)=>{
    res.render("index")
})

server.listen(3000,()=>{
    console.log("server listening on PORT : 3000")
})