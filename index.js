var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

users = [];
connections = [];

io.sockets.on('connection', function (socket) {
    console.log('Success connection');
    connections.push(socket);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnect');
    });

    socket.on('sendMessage', function (data) {

        msg = data.msg;
        user = data.user;
        users.push(user);

        userId = users.indexOf(user);
        console.log('New user, user id: ', userId);


        io.sockets.emit('addMessage', {msg: msg, user: user, userId: userId});
    });
});
