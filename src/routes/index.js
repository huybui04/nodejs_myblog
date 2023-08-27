const newsRouter = require('./news');
const meRouter = require('./me');
const courseRouter = require('./courses');
const siteRouter = require('./site');
const authRouter = require('./auth');

const { requireAuth, checkUser } = require('../app/middlewares/AuthMiddleware');

function route(app) {
    app.use('/auth', checkUser, authRouter);

    app.use('/news', requireAuth, checkUser, newsRouter);

    app.use('/me', requireAuth, checkUser, meRouter);

    app.use('/courses', requireAuth, checkUser, courseRouter);


    app.use('/', requireAuth, checkUser, siteRouter);

}

module.exports = route;
