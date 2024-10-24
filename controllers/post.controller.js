const Post = require('../models/post.model');

// Create post
module.exports.createPost = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to create a post!'
    });
  }
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields!'
    });
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const findPostBySlug = await Post.findOne({ slug });
  if (findPostBySlug) {
    return res.status(409).json({
      success: false,
      message: 'Title already exists!'
    });
  }
  const newPost = {
    ...req.body,
    slug,
    userId: req.user.id
  };
  try {
    const post = await Post.create(newPost);
    return res.status(201).json({
      success: true,
      message: 'Create post successful!',
      post
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all posts
module.exports.getPosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.slug) {
      query.slug = req.query.slug;
    }
    if (req.query.postId) {
      query._id = req.query.postId;
    }
    if (req.query.searchTerm) {
      const regex = { $regex: req.query.searchTerm, $options: 'i' };
      query.$or = [{ title: regex }, { content: regex }];
    }
    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    return res.status(200).json({
      success: true,
      message: 'Get posts successful!',
      totalPosts,
      lastMonthPosts,
      posts
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a post
module.exports.deletePost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to delete this post!'
    });
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    return res.status(200).json({
      success: true,
      message: 'The post has been deleted!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a post
module.exports.updatePost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to delete this post!'
    });
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image
        }
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Update post successful!',
      post: updatedPost
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
