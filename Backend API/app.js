const express = require ( 'express');
const mongoose = require ('mongoose');
const bcryptjs = require ('bcryptjs')
const cors = require ('cors');
const bodyParser = require ('body-parser');
const passport = require ('passport')
const session = require ('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const userRoute = require ('./routes/user.Route');
const requestRouter = require('./routes/request.Route');
const Router = require ("./routes/contact.Route");
const workerRouter = require ('./routes/workerRoute');
const authRouter = require('./middleware/auth');
require('dotenv').config();

// const jwt = require ('jsonwebtoken');







const app = express();
const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection: 'mySessions'
  });
  
  store.on('error', function(error) {
    console.log(error);
  });
  
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
      secret: process.env.SESSION_SECRET, 
      resave: true,
      saveUninitialized: true,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
      },
    })
  );



app.use('/user', userRoute);
app.use('/request',  requestRouter);
app.use('/contact', Router);
app.use('/', authRouter);
app.use('/worker', workerRouter);



mongoose.connect(process.env.MONGO_URI, { 
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    });
})
.catch((err) => console.error('Error connecting to MongoDB:', err));
  
  
const port = 7000;
  
