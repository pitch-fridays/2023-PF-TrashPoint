const Message = require('../models/contact');


exports.messages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {

    const newMessage = new Message({ name, email, message });
    const savedMessage = await newMessage.save();
    res.status(201).json({success: true, message:"Message send successfully", savedMessage});

  } catch (error) {

    res.status(400).json({ error: 'Bad Request' });

  }
};

