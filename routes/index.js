const express = require('express');
const learningRouter = require('./learning')
const router = express.Router();

router.use('/learning',learningRouter)

module.exports = router