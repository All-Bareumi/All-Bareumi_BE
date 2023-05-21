const express = require('express');
const router = express.Router();
const {getSentences,getTypeEnum} = require('../../controllers/sentences.js')

router.get('/list/:category?',getSentences)

router.get('/schema/:schema',getTypeEnum)

module.exports = router;
