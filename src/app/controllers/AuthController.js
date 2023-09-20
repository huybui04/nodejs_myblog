const User = require('../models/User');

const { multipleMongooseToObject } = require('../../ulti/mongoose');
const sendEmail  = require('../../ulti/email')

const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'my course', {
        expiresIn: maxAge
    });
};
// Handle errors
const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'That email is already registered';
      return errors;
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
      console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
}  

class AuthController { 
    // [GET] /auth/signup
    getSignup(req, res, next) {
        res.render('auth/signup');
    };    
 
    // [POST] /auth/signup
    postSignup = async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.create({ email, password });
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: user._id });
        }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
    };
 
    // [GET] /auth/login
    getLogin(req, res, next) {
        res.render('auth/login');
    };    
 
    // [POST] /auth/login
    postLogin = async function (req, res, next) {
        const { email, password } = req.body;
      
        try {
          const user = await User.login(email, password);
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ user: user._id });
        } 
        catch (err) {
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
    }; 

    // [GET] /auth/logout
    getLogout = async function (req, res, next) {
      res.cookie('jwt', '', { maxAge: 1 });
      res.redirect('/');
    };

    // [GET] /auth/forgot
    getForgot(req, res, next) {
      res.render('auth/forgot');
    };      

    // [POST] /auth/forgot
    forgotPassword = async (req, res, next) => {
      const {email} = req.body;

      const user = await User.findOne({email});

      if(!user) {
        const err = {
          errors: {msg:'We could not find this user'}
        }
        return res.status(404).json(err);
      }

      const resetToken = jwt.sign({email:user.email,_id:user._id},  'my course',{expiresIn:'10m'});

      await User.findByIdAndUpdate({_id:user._id}, {passwordResetToken:resetToken});

      const resetUrl = `http://localhost:3000/auth/resetPassword/${user._id}/${resetToken}`;
      console.log(resetUrl);
      const message = `We have received a password reset request. Please use this link to reset your password\n
      ${resetUrl}`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password change request received',
          message: message,
        });

        res.status(200);
      }
      catch(err) {
        user.passwordResetToken = undefined;
        await User.findByIdAndUpdate({_id:user._id}, {passwordResetToken:user.passwordResetToken});
        console.log(err);
      }

      return res.json(user);
    };   

    // [GET] /auth/resetPassword/:id/:token
    getReset = (req, res, next) => {
      res.render('auth/reset');
    };

    // [POST] /auth/resetPassword/:id/:token
    resetPassword = async (req, res, next) => {
      const {id,token} = req.params;

      const user = await User.findOne({_id:id, passwordResetToken:token});

      if(!user) {
        const err = {
          errors: {msg:'Token is invalid or has expired'}
        }
        return res.status(400).json(err);
      }

      //Reset password
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      // user.passwordChangedAt = Date.now;

      user.save();

      //Login 
      const loginToken = createToken(user._id);
      res.cookie('jwt', loginToken, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    };
}


module.exports = new AuthController();
