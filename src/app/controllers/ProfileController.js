const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');

class ProfileController {

    // {GER} /profile
    index(req, res, next) {
        res.render('profile/profile');
    }

}

module.exports = new ProfileController();
