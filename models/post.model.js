const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dzdycjg8q/image/upload/v1729061897/Blog/how-to-write-a-blog-post_fi8ktc.png'
    },
    category: {
      type: String,
      default: 'uncategorized'
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
