const router = require('express').Router();
const auth = require('../controllers/auth.controller');

router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.post('/google', auth.google);
router.post('/signout', auth.signout);

module.exports = router;
