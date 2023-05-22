const express = require('express');

const { login_user, login_kakao, logout_user, logout_kakao } = require('../../controllers/auth');
const {authChecker} = require('../../middlewares');

const router = express.Router();

// POST /auth/login
router.get('/login',login_user);
router.get('/login/callback', login_kakao);


// GET /auth/logout
router.get('/logout',logout_user);
router.get('/logout/callback', logout_kakao);




module.exports = router;
