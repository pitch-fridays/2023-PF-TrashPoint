const validateMessage = (req, res, next) => {
    const { Name, email, message } = req.body;
  
    // Validate that required fields are present
    if (!Name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields for message' });
    }
    if (user) {
        return res.status(400).json({message: "Message send successfully"});
    }
  
    next();
  };
  
module.exports = validateMessage;