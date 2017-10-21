require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo}  = require('./models/todo');
var {User}  = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/** POST Todo */
app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.send(doc);
  }, err => {
    res.status(400).send(err);
  });
});

/** GET all Todos */
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, err => {
    res.status(400).send(err);
  });
});

/** GET individual Todo */
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    !!todo ? res.send({todo}) : res.status(404).send();
  }).catch(e =>{
    res.status(400).send();
  });
});

/** DELETE todo */
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then(todo => {
    !!todo ? res.send({todo}) : res.status(404).send();
  }).catch(e =>{
    res.status(400).send();
  })
})

/** PATCH Todo */
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
    if (!todo){
      return res.status(400).send();
    }

    res.send({todo});
   }).catch(e => {
     console.log(e);
    res.status(400).send();
  })
});

/** POST and create new user */
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  console.log(body);
  var user = new User(body);

  user.save().then(userDoc => {
    res.send(userDoc)
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Started up at ${port}`);
});

module.exports = {app};