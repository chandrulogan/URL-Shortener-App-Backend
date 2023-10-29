// we have to install  the  mongoDB here in order to connect the mongoDB
// npm i mongodb

const mongodb = require('mongodb');
const dbName = 'Shortify';
const dbUrl = `mongodb+srv://zen-class-35:Chandru1234@chandruloganathan.ckkhhdb.mongodb.net/${dbName}?retryWrites=true&w=majority`;

module.exports = { mongodb, dbName, dbUrl }