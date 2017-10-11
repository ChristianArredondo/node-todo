// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp2', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server!');

  // deleteMany
  // db.collection('TodosRound2').deleteMany({text: 'Eat something'}).then(res => {
  //   console.log(res)
  // });
  
  // deleteOne
    db.collection('TodosRound2').deleteOne({text: 'Eat something'}).then(res => {
      console.log(res)
    });

  // findOneAndDelete

  // db.close();
}); 