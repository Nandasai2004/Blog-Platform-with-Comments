const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @route   GET api/comments/:postId
// @desc    Get comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', ['name', 'profilePicture'])
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { postId, text } = req.body;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = new Comment({
      text: text,
      post: postId,
      user: req.user.id
    });

    const comment = await newComment.save();
    await comment.populate('user', ['name', 'profilePicture']);
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.deleteOne();

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
