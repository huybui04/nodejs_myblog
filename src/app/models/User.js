const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = mongoose.Schema({
    email:{ 
        type:String, 
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true, 
        validate: [isEmail , 'Please enter an valid email'],
    },
    password:{ 
        type:String,
        required: [true, 'Please enter an password'],
        minLength: [6, 'Minimum password length is 6 characters'],
    },
    confirmPassword:{ 
      type:String,
      required: [true, 'Please enter confirmpassword'],
      minLength: [6, 'Minimum password length is 6 characters'],
    },
    // passwordChangedAt: { Date },
    passwordResetToken: { String },
})

// Fire a function before doc saved to db
User.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;

    next();
});

// Static method to login user
User.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error('incorrect password');
  }
  throw new Error('incorrect email');
};


module.exports = mongoose.model('User', User);
