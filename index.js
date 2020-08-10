const express = require('express')
const app = express()
const server = require('http').createServer(app)

server.listen(3000)

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/listall', (req, res) => {
  res.sendFile(__dirname + '/views/listall.html')
})

app.get('/getall', async (req, res) => {
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
