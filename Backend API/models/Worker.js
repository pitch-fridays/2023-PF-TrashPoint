const { v4: uuidv4 } = require('uuid');
const mongoose = require ("mongoose");
const schema = mongoose.Schema;

const workerSchema = new schema({
  workerId: {
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
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },

});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;


