const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', ['name', 'profilePicture']).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', ['name', 'profilePicture']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      author: req.user.id
    });

    const post = await newPost.save();
    await post.populate('author', ['name', 'profilePicture']);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, image } = req.body;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Make sure user owns post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('author', ['name', 'profilePicture']);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();
    
    // Also delete comments associated with the post
    await Comment.deleteMany({ post: req.params.id });

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
