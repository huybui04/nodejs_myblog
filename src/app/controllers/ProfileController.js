const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');
const path = require('path');

class ProfileController {

    // [GET] /profile
    index(req, res, next) {
        res.render('profile/profile');
    }

    // [GET] /profile/edit/:id
    show(req, res, next) {
        res.render('profile/edit');
    }

    // [POST] /profile/edit/:id
    edit (req, res, next)  {
        if (!req.body.avatar) req.body.avatar = '';
        else req.body.avatar = req.file.path.split('\\').slice(10).join('/');

        User.updateOne({  _id : req.params.id }, req.body)
            .then(() => res.redirect('/profile'))
            .catch(next);
    }
    
}

module.exports = new ProfileController();
