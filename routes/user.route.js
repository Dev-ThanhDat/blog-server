const router = require('express').Router();
const user = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyUser.middlewares');

router.get('/getusers', verifyToken, user.getUsers);
router.get('/:userId', user.getUser);
router.put('/update/:userId', verifyToken, user.updateUser);
router.delete('/delete/:userId', verifyToken, user.deleteUser);

module.exports = router;
