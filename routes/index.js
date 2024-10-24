const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const postRouter = require('./post.route');
const commentRouter = require('./comment.route');

const initRoutes = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/post', postRouter);
  app.use('/api/comment', commentRouter);
};

module.exports = initRoutes;
