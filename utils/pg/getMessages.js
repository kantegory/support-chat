const client = require('./connector')

const getMessages = async (userId) => {

  let _res = []

  const query = {
    text: 'SELECT * from chat_messagemodel WHERE user_id = $1 OR recipient_id = $1;',
    values: [Number(userId)],
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getMessages
