const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true,
        ref: "user",
      },
    
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.model("token", tokenSchema);
