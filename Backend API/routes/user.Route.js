const express = require ('express');
const {createUser, login, updateUser, Reset, newPassword, getUserCount, createAdmin, adminLogin, deleteUser} = require ('../controller/user.Controller');
const User = require ("../models/User")
const crypto = require ('crypto');
const userRoute = express.Router();




userRoute.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ message: 'All users', users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching users' });
  }
});



userRoute.post('/signup', createUser);
userRoute.post("/login", login)
userRoute.put('/update/:userId', updateUser);

userRoute.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.send('Logged out successfully');
    }
  });
});


userRoute.post('/reset', Reset);

userRoute.post("/passwordReset/:userId/:token", newPassword);
userRoute.get('/count', getUserCount);
userRoute.post('/admin/login', adminLogin);
userRoute.post('/admin', createAdmin);



module.exports = userRoute;
