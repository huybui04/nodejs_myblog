const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');

class ProfileController {

    // [GET] /profile
    index(req, res, next) {
        res.render('profile/profile');
    }

    // [GET] /profile/edit
    show(req, res, next) {
        res.render('profile/edit');
    }
    
}

module.exports = new ProfileController();
