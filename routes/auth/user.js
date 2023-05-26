const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const { user_info, user_photo } = require('../../controllers/auth.js');
const {authChecker} = require('../../middlewares');
const router = express.Router();

// POST /auth/login

router.get('/me',authChecker,user_info);

router.post('/photos/upload',upload.single('data'),user_photo);


module.exports = router;
