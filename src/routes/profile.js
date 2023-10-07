const express = require('express');
const multer = require('multer');
const path = require('path');

const profileController = require('../app/controllers/ProfileController');

const router = express.Router();
router.use(express.static(__dirname+'./public/'));

const Storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../public/uploads'),
    filename:(req,file,cb)=> {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

const maxSize = 1 * 1024 * 1024;
const upload = multer({
    storage: Storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" 
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Chỉ .png, .jpg and .jpeg'));
        }
    },
    limits: { fileSize: maxSize },
}).single('avatar');

router.get('/edit/:id', profileController.show);
router.post('/edit/:id', upload , profileController.edit);
router.get('/', profileController.index);


module.exports = router;