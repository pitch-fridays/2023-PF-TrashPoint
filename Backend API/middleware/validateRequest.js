const validateRequest = (req, res, next) => {
    const { requestType, location, date, time } = req.body;
  
    if (!requestType || !location || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields for request' });
    }
      next();
  };
  



  
  module.exports = validateRequest;