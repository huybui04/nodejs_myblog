const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');


router.get('/search', siteController.getSearch);
router.post('/search', siteController.postSearch);
router.get('/',  siteController.index);


module.exports = router;