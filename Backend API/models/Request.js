const { v4: uuidv4 } = require('uuid');
const mongoose = require ("mongoose");
const schema = mongoose.Schema;

const requestSchema = new schema({
  requestId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  requestType:{
    type: String,
    required: true
  },

  location: {
  type: String,
   required: true
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending',
  },
  
});


const Request = mongoose.model('Request', requestSchema);

module.exports = Request;