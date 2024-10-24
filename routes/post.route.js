const router = require('express').Router();
const post = require('../controllers/post.controller');
const { verifyToken } = require('../middlewares/verifyUser.middlewares');

router.get('/getposts', post.getPosts);
router.post('/create', verifyToken, post.createPost);
router.delete('/deletepost/:postId/:userId', verifyToken, post.deletePost);
router.put('/updatepost/:postId/:userId', verifyToken, post.updatePost);

module.exports = router;
