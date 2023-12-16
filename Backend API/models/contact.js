const mongoose = require ("mongoose");
const schema = mongoose.Schema;

const messageSchema = new schema({
  name: {
  type: String,
   required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;