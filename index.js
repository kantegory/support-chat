const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// include auth
const passport = require('passport');
const session = require('express-session');

// include mongo
const addMessages = require('./utils/mongo/addMessage');

server.listen(3000);

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

users = [];
connections = [];
messages = [];

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

        msgObj = {'msg': data.msg, 'user': data.user}

        messages.push(msgObj);

        addMessages([msgObj]);

        userId = users.indexOf(user);
        console.log('New user, user id: ', userId);

        io.sockets.emit('addMessage', {msg: msg, user: user, userId: userId});
    });
});
