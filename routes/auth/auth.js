const express = require('express');

const { login, logout } = require('../../controllers/auth');

const router = express.Router();

// POST /auth/login
router.get('/login', login);

// GET /auth/logout
router.get('/logout', logout);




module.exports = router;
