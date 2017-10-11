// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp2', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server!');

  // findOneAndUpdate

  // db.collection('TodosRound2').findOneAndUpdate(
  //   {
  //     text: 'Lol what'
  //   },
  //   {
  //     $set: {completed: true}
  //   },
  //   {
  //     returnOriginal: false
  //   }
  // ).then(result => {
  //   console.log(result);
  // })
  db.collection('Users2').findOneAndUpdate({
      name: 'Christian'
    }, {
      $set: {
        name: 'ChristianLol'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }
  ).then(result => {
    console.log(result);
  })

  // db.close();
}); 