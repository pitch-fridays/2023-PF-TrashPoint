const mongoose = require('mongoose');

const userCountSchema = new mongoose.Schema({
  count: { type: Number, 
    default: 0 
},
});

const UserCount = mongoose.model('UserCount', userCountSchema);

module.exports = UserCount;
