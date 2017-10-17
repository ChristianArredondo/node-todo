const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59e554d97b5ba22bb0261b0511';

// if (!ObjectID.isValid(id)) {
//   console.log('Error is not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id: ', todo);
// }).catch(e => {
//   console.log(e);
// });

const id = '59e42f95bb3f201abb2b216d';

User.findById(id).then(user => {
  if (!user) {
    console.log('User not found');
  }
  console.log('User found: ', user);
}).catch(e => {
  console.log('Erro: ', e);
});