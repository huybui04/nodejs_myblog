const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../ulti/mongoose');

class SiteController {
    // [GET] /
    index(req, res, next) {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 6;

        Promise.all([Course.find({owner:res.locals.user}).skip((perPage*page)-perPage).limit(perPage), 
            Course.countDocuments({owner:res.locals.user})])
            .then(([courses, count]) => 
                res.render('home', {
                    courses: multipleMongooseToObject(courses),
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count,
                })
            )
            .catch(next);
    }
        
    // [GET] /search
    getSearch(req, res) {
        res.render('search');
    }

    // [POST] /seaerch
    postSearch(req, res, next) {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 6;
        let searchFound = false;
        Promise.all([Course.find({ owner:res.locals.user, $text: {$search: req.body.courseName} }).skip((perPage*page)-perPage).limit(perPage), 
            Course.countDocuments({ owner:res.locals.user, $text: {$search: req.body.courseName} })])
            .then(([courses, count]) => {
                if (courses.length) searchFound = true;
                res.render('search', {
                    courses: multipleMongooseToObject(courses),
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count,
                    searchFound,
                })
            })
            .catch(next);
    }
}

module.exports = new SiteController();
