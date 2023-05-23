const express = require('express');
const router = express.Router();
const {getSentences,getTypeEnum,putSentences} = require('../../controllers/sentences.js')
const {authChecker} = require('../../middlewares');

router.get('/list/:category?',authChecker,getSentences)

router.get('/category',authChecker,getTypeEnum)

router.put('/insert',putSentences)

module.exports = router;
