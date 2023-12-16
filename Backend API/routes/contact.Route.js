const express = require ('express');
const {sendMessage, messages} = require ('../controller/contact.controller');

const Router = express.Router();


Router.post('/send', sendMessage);
Router.get('/admin/messages', messages);



module.exports = Router;
























// const express = require ("express");
// const { sendMessage, messages } = require("../controller/contact.controller");
// const Router = express.Router();

// Router.get('/messages', async (req, res) => {
//   try {
//     const messages = await Message.find({});
//     res.send({ message: 'All messages', messages });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching messages' });
//   }
//   messages
// });

// Router.post('/send', async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     const newMessage = new Message({ name, email, message });
//     const savedMessage = await newMessage.save();
//     res.status(201).json(savedMessage);
//   } catch (error) {
//     res.status(400).json({ error: 'Bad Request' });
//   }
//   sendMessage
// });


// module.exports = Router;
