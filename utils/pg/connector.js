const { Client } = require('pg')
const ini = require('ini')
const fs = require('fs')

const confPath = "/home/kantegory/work/chat/support-chat/conf/config.ini"

const db = ini.parse(fs.readFileSync(confPath, 'utf-8')).db

const client = new Client({
  user: db.user,
  host: db.host,
  database: db.name,
  password: db.password,
  port: db.port,
})

client.connect()

module.exports = client

