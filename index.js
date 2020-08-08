const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const saveMessage = require('./utils/pg/saveMessage');
const getMessages = require('./utils/pg/getMessages');

server.listen(3000);

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

users = [];
connections = [];
messages = [];

io.sockets.on('connection', async function (socket) {
    console.log('Success connection');
    connections.push(socket);

    let msgs = await getMessages(2);

    console.log('msgs are', msgs)

    msgs.forEach((msg) => {
      io.sockets.emit('addMessage', {msg: msg.body, user: 'username', userId: msg.user_id})
    })

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnect');
    });

    socket.on('sendMessage', function (data) {

        msg = data.msg;
        user = data.user;
        users.push(user);

        msgObj = {'body': data.msg, 'userId': data.user}

        messages.push(msgObj);

        saveMessage(msgObj);

        userId = users.indexOf(user);
        console.log('New user, user id: ', userId);

        io.sockets.emit('addMessage', {msg: msg, user: user, userId: userId});
    });
});
