const express = require('express');
const sentences = require('./sentences.js')
const router = express.Router();

router.use('/sentences',sentences)

module.exports = router