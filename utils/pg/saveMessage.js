const client = require('./connector')

const saveMessage = (msgObj) => {

  if (!msgObj.recipientId) {
    msgObj.recipientId = 1
  }

  const query = {
    text: 'INSERT INTO chat_messagemodel(timestamp, body, recipient_id, user_id) VALUES(CURRENT_TIMESTAMP, $1, $2, $3);',
    values: [msgObj.body, Number(msgObj.recipientId), Number(msgObj.userId)],
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveMessage
