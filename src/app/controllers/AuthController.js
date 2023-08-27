const User = require('../models/User');
const { multipleMongooseToObject } = require('../../ulti/mongoose');
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
            res.json({ errors });
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
          res.json({ errors });
        }
    }; 

    // [GET] /auth/logout
    getLogout = async function (req, res, next) {
      res.cookie('jwt', '', { maxAge: 1 });
      res.redirect('/');
    };

}

module.exports = new AuthController();
