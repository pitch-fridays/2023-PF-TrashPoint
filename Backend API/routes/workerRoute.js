const express = require ('express');
const {addWorker, getAllWorkers} = require ('../controller/workerController');

const workerRouter = express.Router();


workerRouter.post('/admin/add', addWorker);
workerRouter.get('/admin/getAll', getAllWorkers);




module.exports = workerRouter;