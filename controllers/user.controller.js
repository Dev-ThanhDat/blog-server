const User = require('../models/user.model');

// Update user
module.exports.updateUser = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to update this user!'
    });
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 7 and 30 characters!'
      });
    }
    if (req.body.username.includes(' ')) {
      return res.status(400).json({
        success: false,
        message: 'Username cannot contain spaces!'
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Username must be lowercase!'
      });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          profilePicture: req.body.profilePicture
        }
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json({
      success: true,
      message: 'Update user successful!',
      user: rest
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to delete this user!'
    });
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({
      success: true,
      message: 'User has been deleted!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all users
module.exports.getUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to see all users!'
    });
  }
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    return res.status(200).json({
      success: true,
      message: 'Get users successful!',
      totalUsers,
      lastMonthUsers,
      users: usersWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a user
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      });
    }
    const { password, ...rest } = user._doc;
    return res.status(200).json({
      success: true,
      message: 'Get user successful!',
      user: rest
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
