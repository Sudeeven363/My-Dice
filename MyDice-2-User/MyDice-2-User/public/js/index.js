let socket = io();

var meUser;
var status='start';

window.onload=function(){
    document.getElementById("replay").style.display='none';
    document.getElementById("ch-name").style.display='none';
    document.getElementById("rematch").style.display='none';
    socket.emit('Cache');
    socket.on('call',function(data){
        console.log('Start play');
        document.getElementById('result').innerHTML = data+' has started the game!';
    });
}

socket.on('connect',function(){
    console.log('You are connected to the server');
    // socket.on('call',function(data){
    //     console.log('Start play');
    //     document.getElementById('result').innerHTML = data.Name+' has started the game!';
    // });
    
        
    document.querySelector('#GO-btn').addEventListener('click', function(event){
        event.preventDefault();
        console.log('Submit is cancelled');
        meUser = document.getElementById("input").value;
        document.getElementById("input").disabled = true;
        if(status=='start'){
            console.log('play started');
            socket.emit('myNum',meUser);
            document.getElementById('GO-btn').style.display='none';
        }
        else if(status=='change'){
            console.log('ch-name');
            socket.emit('NameChange',meUser);
        }
    })
});

socket.on('disconnect',function(){
    console.log('You are disconnected to the server');
});

socket.on('yourNum',function(data){
    console.log(data);
});

socket.on('winner',function(data){
    console.log('The winner is '+data.Name+' as he got '+data.Num);
    document.getElementById('GO-btn').style.display='none';
    document.getElementById('result').innerHTML =  'The winner is '+data.Name+' as he got '+data.Num+'.\r'+data.User1.Name+' got '+data.User1.Num+' and '+data.User2.Name+' got '+data.User2.Num;
    document.getElementById('replay').style.display='block';
    document.getElementById('ch-name').style.display='block';

    document.querySelector('#replay').addEventListener('click', function(event){
        event.preventDefault();
        console.log('Replay');
        document.getElementById('result').innerHTML ='';
        socket.emit('replay-msg',meUser);
        //socket.emit('myNum', meUser);
    });

    document.querySelector('#ch-name').addEventListener('click', function(event){
        event.preventDefault();
        document.getElementById('ch-name').style.display='none';
        document.getElementById('GO-btn').style.display='block';
        document.getElementById("input").disabled = false;
        document.getElementById('msg').innerHTML = '';
        document.getElementById('result').innerHTML ='Change your name and hit GO';
        status='change';
        console.log(status);
        
        // console.log('ch-name & replay');
        // meUser = document.getElementById("input").value; 
        // socket.emit('replay-msg',meUser);
        //socket.emit('myNum', meUser);
    });
});

socket.on('replay-msg-a',function(data){
    if(data==meUser){
        document.getElementById('msg').innerHTML = 'You have restarted the game!';
    }
    else if(data!=meUser){
        document.getElementById('msg').innerHTML = data+' has restarted the game!';
    }

    document.getElementById('replay').style.display='none';
});

socket.on('NameReq',function(){
    socket.emit('NameReq-ans',meUser);
})


// socket.on('call',function(data){
//     console.log('Start play');
//     document.getElementById('result').innerHTML = data.Name+' has started the game!';
// });