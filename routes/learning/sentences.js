const express = require('express');
const router = express.Router();
const {getSentences,getTypeEnum,putSentences,postCategory} = require('../../controllers/sentences.js')
const {authChecker} = require('../../middlewares');

router.get('/list/:category?/:selectedCharacter?',authChecker,getSentences)

router.get('/category',authChecker,getTypeEnum)

router.post('/category',authChecker,postCategory)
router.put('/insert',authChecker,putSentences)



module.exports = router;
