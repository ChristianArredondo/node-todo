const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: 
        {
          type: String,
          required: true
        },
      token: 
        {
          type: String,
          required: true
        }
    }
  ]
});

// Called automatically by JSON.stringifym
UserSchema.methods.toJSON = function () {
  // references user directly
  var user = this;
  // converts mongoose object to regular schema object for existing props
  var userObject = user.toObject();

  // return only id and email to user for security purposes - no pass or token
  return _.pick(userObject, ['_id', 'email']);
};

// Adds generateToken method (Instance methods get called with the individual document)
UserSchema.methods.generateAuthToken = function () {
  // references user directly
  var user = this;
  // access key name
  var access = 'auth';
  // generate token and push to tokens array
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123ROFL').toString();
  user.tokens.push({access, token});
  // return token on save
  return user.save().then(() => {
    return token;
  });
};

// Model method gets called with the model (statics)
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  // check validation
  try {
    decoded = jwt.verify(token, 'abc123ROFL');
  } catch (e) {
    // equivalent to long-hand promise reject notation
    return Promise.reject();
  }
  // use 'return' to access Promise in server with 'then'
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};  