// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp2', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server!');

  // db.collection('TodosRound2').insertOne({
  //   text: 'Nothing to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error', err)
  //   };

  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  // db.collection('Users2').insertOne({
  //   name: 'Christian',
  //   age: 26,
  //   location: 'Houston, TX'
  // }, (err, result) => {
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  db.close();
}); 