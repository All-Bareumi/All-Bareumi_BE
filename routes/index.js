const express = require('express');
const learningRouter = require('./learning')
const authRouter = require('./auth/auth.js')
const router = express.Router();

router.use('/learning',learningRouter)
router.use('/auth',authRouter)


module.exports = router