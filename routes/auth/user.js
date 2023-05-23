const express = require('express');

const { user_info } = require('../../controllers/auth.js');
const {authChecker} = require('../../middlewares');
const router = express.Router();

// POST /auth/login

router.get('/me',authChecker,user_info)


module.exports = router;
