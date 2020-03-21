const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// include mongodb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'socketio-chat';
 
// Use connect method to connect to the server
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to mongodb server");
 
  const db = client.db(dbName);
 
  client.close();
});

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
