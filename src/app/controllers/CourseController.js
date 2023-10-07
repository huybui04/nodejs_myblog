const Course = require('../models/Course');
const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');

class CourseController {
    
    // [GET] /course/:slug
    show = async (req, res, next) =>{

        Promise.all([ Course.find({owner:res.locals.user}).skip(1).limit(4), Course.findOne({ slug: req.params.slug }) ])
            .then(([recomendCourses, course]) => {
                res.render('courses/show', { 
                    recomendCourses: multipleMongooseToObject(recomendCourses),
                    course: mongooseToObject(course),
                });
            })
            .catch(next);
    }

    // [GET] /course/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // [POST] /course/store
    store(req, res, next) {
        req.body.img = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        req.body.owner = res.locals.user;
        const course = new Course({...req.body});
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(err => {
                
            }); 
    }

    // [GET] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', {
                course: mongooseToObject(course),
            }))
            .catch(next)
    }

    // [PUT] /course/:id/edit
    update(req, res, next) {
        req.body.img = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        Course.updateOne({ _id : req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // [DELETE] /course/:id
    destroy(req, res, next) {
        Course.delete({ _id : req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

     // [DELETE] /course/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id : req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PATCH] /course/:id/restore
    restore(req, res, next) {
        Course.restore({ _id : req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


    // [POST] /course/handle-form-actions
    handleFormActions(req, res, next) {
        switch(req.body.action) {
            case 'delete':
                Course.delete({ _id : { $in: req.body.courseIds} })
                .then(() => res.redirect('back'))
                .catch(next);                
                break;
            case 'forceDelete':
                Course.deleteMany({ _id : { $in: req.body.courseIds} })
                .then(() => res.redirect('back'))               
                break;    
            case 'restore':
                Course.restore({ _id : { $in: req.body.courseIds} })
                .then(() => res.redirect('back'))
                .catch(next);                
                break;                 
            default:
                res.json({ message: 'Action invalid!' });    
        }
    }
}

module.exports = new CourseController();
