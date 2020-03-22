function mongo() {

    // include mongodb
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'socketio-chat';

    // Use connect method to connect to the server
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to mongodb server");

        const db = client.db(dbName);

        client.close();
    });
}

module.exports = (mongo)();
