const nodemailer = require('nodemailer');
const User = require('../models/User'); 
const UserCount = require ('../models/userCount');
const Token = require ('../models/Token');
const sendEmail = require ('../utils/sendEmail');
const bcryptjs = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



exports.createUser = async (req, res) => {
  const { fullName, phone, password } = req.body;

  if (!fullName || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Could not create user' });
  }
};


exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { fullName, email, state, country, phone, address } = req.body;

  try {
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.fullName = fullName;
    user.email = email;
    user.state = state;
    user.country = country;
    user.phone = phone;
    user.address = address;

    await user.save();
    res.redirect("")
    res.status(200).json({ success:true, message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};



const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcryptjs.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};



exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (phone === '' || password === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    req.session.user = {
      _id: user._id,
      phone: user.phone,
    };
    res.json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }


};

exports.Reset = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User with the given email doesn't exist");
    }

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(10).toString('hex'),
      }).save();
    }

    const resetLink = `https://trashpoint.vercel.app/user/passwordReset/${user._id}/${token.token}`;

    await sendEmail(user.email, 'Password reset', resetLink);

    res.send('Password reset link sent to your email account');
  } catch (error) {
    res.status(500).send('An error occurred');
    console.error(error);
  }
};

exports.newPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("Invalid link or expired");

    const token = await Token.findOneAndDelete({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link or expired");

    // Hash the new password before saving it
    const newPassword = req.body.password;
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();
    res.redirect("/login");
    res.send("Password reset successfully.");
  } catch (error) {
    res.status(500).send("An error occurred");
    console.error(error);
  }
};




exports.getUserCount = async (req, res) => {
  try {
    const userCountDoc = await UserCount.findOne();
    const count = userCountDoc ? userCountDoc.count : 0;
    res.json({ userCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve user count', error: error.message });
  }
};


exports.createAdmin = async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }
    const hashedPassword = await hashPassword(password);
    const isAdmin = true;

    const newAdmin = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin user added successfully', user: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Could not add admin user', error: error.message });
  }
};
 
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    const token = jwt.sign({ _id: user._id, isAdmin: true }, "thisisasecret", { expiresIn: '1h' });

    res.json({ success: true, message: 'Admin Login successful', user, token });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the requesting user is an admin
    const requestingUser = req.user; // Assuming you have user information stored in the request object
    if (!requestingUser || !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
