const router = require('express').Router();
const comment = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/verifyUser.middlewares');

router.get('/getcomments', verifyToken, comment.getComments);
router.get('/getPostComments/:postId', comment.getPostComments);
router.post('/create', verifyToken, comment.createComment);
router.put('/likeComment/:commentId', verifyToken, comment.likeComment);
router.put('/editComment/:commentId', verifyToken, comment.editComment);
router.delete('/deleteComment/:commentId', verifyToken, comment.deleteComment);

module.exports = router;
