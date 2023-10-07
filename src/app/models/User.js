const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = mongoose.Schema({
    name: {
        type:String,
    },
    email:{ 
        type:String, 
        required: [true, 'Hãy nhập email'],
        unique: true,
        lowercase: true, 
        validate: [isEmail , 'Hãy nhập email hợp lệ'],
    },
    password:{ 
        type:String,
        required: [true, 'Hãy nhập mật khẩu'],
        minLength: [6, 'Mật khẩu ít nhất 6 chữ số'],
    },
    confirmPassword:{ 
        type:String,
        minLength: [6, 'Mật khẩu ít nhất 6 chữ số'],
        required: [true, 'Hãy xác nhận lại mật khẩu'],
    },
    avatar: {
        type:String,
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
