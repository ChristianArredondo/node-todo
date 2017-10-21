require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo}  = require('./models/todo');
var {User}  = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

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
  var user = new User(body);

  user.save().then(() => {
    // generate token upom save
    return user.generateAuthToken();
  }).then(token => {
    // retrieve generated token and send as Header
    res.header('x-auth', token).send(user)
  }).catch(err => {
    res.status(400).send(err);
  });
});

// GET request for user using authentication
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST login and authentication
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    // Search for user with login info
    User.findByCredentials(body.email, body.password).then(user => {
      // return generated token
      return user.generateAuthToken().then(token => {
        // set token as header response
        res.header('x-auth', token).send(user);
      })
    }).catch(err => {
      res.status(400).send();
    })
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started up at ${port}`);
});

module.exports = {app};