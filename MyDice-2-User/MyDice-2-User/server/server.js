const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicpath = path.join(__dirname, '/../public');
const port = 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicpath));

var User1 ={
    Name: '',
    Num: 0
}
var User2 ={
    Name: '',
    Num: 0
}
var WIN = {
    Name: '',
    Num:0,
    User1: User1,
    User2: User2
};
var u1 = '1', u2 = '1';
var state = 'start';
var chUser='';

function maxGen(U1, U2){
    var s1=U1;
    var s2=U2;

    User1.Name=s1;
    User1.Num=Math.floor((Math.random() * 6) + 1);
    User2.Name=s2;
    User2.Num=Math.floor((Math.random() * 6) + 1);

    if(User1.Num==User2.Num){
        maxGen(s1, s2);
    }
    else if(User1.Num!=User2.Num){
        WIN.Num = Math.max(User1.Num, User2.Num);
        if(WIN.Num == User1.Num && WIN.Num != User2.Num){
            WIN.Name = User1.Name;
        }
        else if(WIN.Num == User2.Num && WIN.Num != User1.Num){
            WIN.Name = User2.Name;
        }
    }
};

io.on('connection',function(socket){
    socket.on('Cache',function(){
        if(u1!='1'){
            socket.emit('call',u1)
        }
    })
    console.log('You are connected to the client!!!');
    socket.on('myNum', function(data){
        socket.emit('yourNum',data);
        if(state=='start'){
            u1 = data;
            console.log('User1: ',u1);
            state='User1 started';
            io.emit('call',u1);
        }
        else if(state=='User1 started'){
            u2 = data;
            console.log('User2: ',u2);
            state='win';
            if(state=='win'){
                maxGen(u1, u2);
                io.emit('winner',WIN);
                state='start'
            }
        }
        });

    socket.on('replay-msg',function(data){
        if(data==u1 && data!=u2){
            u1=data;
            maxGen(u1, u2);
            io.emit('replay-msg-a',u1);
        }
        else if(data==u2 && data!=u1){
            u2=data;
            maxGen(u1, u2);
            io.emit('replay-msg-a',u2);
        }
        io.emit('winner',WIN);
    });

    socket.on('NameChange',function(data){
        chUser=data;
        socket.broadcast.emit('NameReq');
    })

    socket.on('NameReq-ans',function(data){
        if(data==u1 && data!=u2){
            u2=chUser;
            maxGen(u1, u2);
            io.emit('replay-msg-a',u2);
        }
        else if(data==u2 && data!=u1){
            u1=chUser;
            maxGen(u1, u2);
            io.emit('replay-msg-a',u1);
        }
        io.emit('winner',WIN);
    })

    socket.on('disconnect',function(){
        console.log('You are disconnected to the client');
    });
})

server.listen(port, function(){
    console.log('The server has finally connected, on http://localhost:'+port);
});