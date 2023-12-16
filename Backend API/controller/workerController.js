const Worker = require ('../models/Worker');


exports.addWorker = async (req, res) => {
    const {fullName, phone, email, address} = req.body;
    try {
        const newWorker = new Worker({
            fullName,
            phone,
            email,
            address,
          });
      
          await newWorker.save();
          res.status(201).json({ message: 'Worker added successfully', worker: newWorker });
    } catch (error) {
          res.status(500).json({ message: 'Could not add worker.', error: error.message });
    }
};


exports.getAllWorkers = async (req, res) => {
    try {
      const allWorkers = await Worker.find();
      res.json({ workers: allWorkers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};