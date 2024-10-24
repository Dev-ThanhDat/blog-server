const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/dzdycjg8q/image/upload/v1729061748/Blog/image_user_awhf51.webp'
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
