const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SignUp
module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required!'
    });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = {
    username,
    email,
    password: hashedPassword
  };
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists!'
      });
    } else {
      await User.create(newUser);
      return res.status(201).json({
        success: true,
        message: 'Signup successful!'
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// SignIn
module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === '' || password === '') {
    return res.status(400).json({
      success: false,
      message: 'All fields are required!'
    });
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password!'
      });
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    return res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: 'production',
        sameSite: 'None',
        maxAge: 365 * 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
        message: 'Signin successful!',
        user: rest
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Google
module.exports.google = async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: 'production',
          sameSite: 'None',
          maxAge: 365 * 24 * 60 * 60 * 1000
        })
        .json({
          success: true,
          user: rest
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = {
        username: name.toLowerCase().split(' ').join(''),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      };
      const user = await User.create(newUser);
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: 'production',
          sameSite: 'None',
          maxAge: 365 * 24 * 60 * 60 * 1000
        })
        .json({
          success: true,
          user: rest
        });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// SingOut
module.exports.signout = async (req, res) => {
  try {
    return res.status(200).clearCookie('access_token').json({
      success: true,
      message: 'User has been signed out!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
