const mongoose = require('mongoose');
const { credentials } = require('../../config/config.json');

const connect = (uri) => 
    mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });

const database = connect(credentials.mongo);

module.exports = database;