const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

const saveMessage = require('./utils/pg/saveMessage')
const getMessages = require('./utils/pg/getMessages')

server.listen(3000)

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/listall', (req, res) => {
  res.sendFile(__dirname + '/views/listall.html')
})

app.get('/getall', async (req, res) => {
  // console.log('this is request', req.query)
  let msgs = await getMessages(1)

  msgs = msgs.filter(msg => msg.user_id !== 1)

  let chats = [];

  msgs.forEach((msg) => {
    if (!chats.includes(msg.user_id)) {
      chats.push(msg.user_id)
    }
  })

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.write(JSON.stringify({ data: chats }))
  res.end()
})

users = {}
connections = []
messages = []

io.sockets.on('connection', function(socket) {
  console.log('Success connection')
  connections.push(socket)

  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1)
    for (user in users) {
      if (socket.id === users[user]) {
        delete users[user]
        console.log('updated users are', users)
      }
    }
    console.log('Disconnect')
  })

  socket.on('addUser', async function(data) {
    users[data.userId] = socket.id
    console.log('updated users are', users)
    let msgs = await getMessages(data.userId)

    console.log('msgs are', msgs)

    msgs.forEach((msg) => {
      io.sockets.to(socket.id).emit('addMessage', { msg: msg.body, user: 'username', userId: msg.user_id })
    })

  })

  socket.on('sendMessage', function(data) {

    msg = data.msg
    user = data.user
    socketId = socket.id
    to = data.to

    console.log('msg will be sended to user with id:', to)

    msgObj = { 'body': data.msg, 'userId': data.user }

    messages.push(msgObj)

    saveMessage(msgObj)

    if (Number(data.user) !== 1) {
      io.sockets.to(users['1']).emit('addMessage', { msg: msg, user: user, userId: data.user })
    } else {
      io.sockets.to(users[data.to]).emit('addMessage', { msg: msg, user: user, userId: data.user })
    }

    // io.sockets.to(users[data.user]).emit('addMessage', { msg: msg, user: user, userId: data.user })
    io.sockets.to(socket.id).emit('addMessage', { msg: msg, user: user, userId: data.user })
  })
})
