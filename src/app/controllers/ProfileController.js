const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');
const path = require('path');

class ProfileController {

    // [GET] /profile
    index(req, res, next) {
        res.render('profile/profile');
    }

    // [GET] /profile/edit
    show(req, res, next) {
        res.render('profile/edit');
    }

    // [POST] /profile/edit
    edit(req, res, next) {
        req.body.avatar = req.file.path.split('\\').slice(10).join('/');

        User.updateOne({  _id : req.params.id }, req.body)
            .then(() => res.redirect('/profile'))
            .catch(next);
    }
    
}

module.exports = new ProfileController();
