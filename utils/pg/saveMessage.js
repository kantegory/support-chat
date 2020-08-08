const client = require('./connector')

const saveMessage = (msgObj) => {
  client.connect()

  const query = {
    text: 'INSERT INTO chat_messagemodel(timestamp, body, recipient_id, user_id) VALUES(CURRENT_TIMESTAMP, $1, $2, $3);',
    values: [msgObj.body, 1, Number(msgObj.userId)],
  }

  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
    client.end()
  })
}

module.exports = saveMessage
