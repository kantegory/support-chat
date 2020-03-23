const assert = require('assert');

// use separate config
const MongoConfig = require('./mongoConfig');
const MongoClient = MongoConfig.MongoClient;
const dbName = MongoConfig.dbName;
const url = MongoConfig.url;

function insertMessages(db, messages, callback) {
    // Get the messages collection
    const collection = db.collection('messages');
    // Insert some messages
    collection.insertMany(messages, function(err, result) {
        assert.equal(err, null);
        assert.equal(messages.length, result.result.n);
        assert.equal(messages.length, result.ops.length);
        console.log(`Inserted ${messages.length} messages into the collection`);
        callback(result);
    });
}

function addMessage(messages) {
    console.log(messages);

    // Use connect method to connect to the server
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to mongodb server");

        const db = client.db(dbName);

        insertMessages(db, messages, function() {
            client.close();
        });

    });
}

module.exports = (addMessage);
