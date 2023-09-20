const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);
router.get('/forgot', authController.getForgot);
router.post('/forgot', authController.forgotPassword);
router.get('/resetPassword/:id/:token', authController.getReset);
router.patch('/resetPassword/:id/:token', authController.resetPassword);

module.exports = router;