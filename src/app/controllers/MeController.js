const Course = require('../models/Course');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');

class MeController {

    // [GET] /me/stored/courses
    storedCourses(req, res, next) {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 6;
        let courseQuery = Course.find({owner:res.locals.user}).skip((perPage*page)-perPage).limit(perPage);


        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type
            });
        };
        Promise.all([courseQuery, Course.countDocuments({owner:res.locals.user}), Course.countDocumentsDeleted({owner: res.locals.user})])
            .then(([courses, count, deletedCount]) => 
                res.render('me/stored-courses', {
                    deletedCount,
                    count,
                    courses: multipleMongooseToObject(courses),
                    current: page,
                    pages: Math.ceil(count / perPage),
                })
            )
            .catch(next);
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 6;

        Promise.all([Course.findDeleted({owner: res.locals.user}).skip((perPage*page)-perPage).limit(perPage), Course.countDocumentsDeleted({owner:res.locals.user})])
            .then(([courses, deletedCount]) => res.render('me/trash-courses', {
                courses: multipleMongooseToObject(courses),
                deletedCount,
                current: page,
                pages: Math.ceil(deletedCount / perPage),
            }))
            .catch(next);
    }
}

module.exports = new MeController();
