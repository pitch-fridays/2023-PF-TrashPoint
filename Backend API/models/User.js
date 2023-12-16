// const { UUID } = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const mongoose = require ("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },

  fullName: {
    type: String,
    required: true
  },

  phone: {
    type: Number,
    required: false,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
  }],
  requestCount: {
    type: Number,
    default: 0, 
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;


