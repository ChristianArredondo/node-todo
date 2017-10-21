const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

user1Id = new ObjectID();
user2Id = new ObjectID();

const users = [
  {
    _id: user1Id,
    email: 'lol@lol.com',
    password: 'user1Pass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'},'abc123ROFL').toString()
      }
    ]
  },
  {
    _id: user2Id,
    email: 'lol2@lol.com',
    password: 'user12Pass',
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

// Clear pre-existing test data and populate using seed data
const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save();
    var user2 = new User(users[1]).save();

    return Promise.all([user1, user2])
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};