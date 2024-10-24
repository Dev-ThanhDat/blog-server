const Comment = require('../models/comment.model');

// Create post
module.exports.createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to create this comment!'
      });
    }
    const comment = await Comment.create({
      content,
      postId,
      userId
    });
    return res.status(201).json({
      success: true,
      message: 'Create comment successful!',
      comment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all posts
module.exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    });
    return res.status(200).json({
      success: true,
      message: 'Get comments successful!',
      comments
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Like comment
module.exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      });
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json({
      success: true,
      message: 'Like comment successful!',
      comment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Edit comment
module.exports.editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to edit this comment!'
      });
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Edit comment successful!',
      editedComment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete comment
module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this comment!'
      });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({
      success: true,
      message: 'Comment has been deleted!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get comments
module.exports.getComments = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to get all comments!'
    });
  }
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    return res.status(200).json({
      success: true,
      message: 'Get comments successful!',
      totalComments,
      lastMonthComments,
      comments
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
