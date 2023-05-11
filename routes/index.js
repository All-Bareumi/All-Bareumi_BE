const express = require('express');
const learningRouter = require('./learning')
const testRouter = require('./test')
const router = express.Router();

router.use('/learning',learningRouter)
router.use('/test',testRouter)

module.exports = router