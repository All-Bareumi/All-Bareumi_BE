const express = require('express');
const learningRouter = require('./learning')
const authRouter = require('./auth/auth.js')
const userRouter = require('./auth/user.js')
const router = express.Router();

router.use('/learning',learningRouter)
router.use('/auth',authRouter)
router.use('/user',userRouter)


module.exports = router