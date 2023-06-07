const express = require('express');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../All-Bareumi_AI/Flask')
    },
    filename: (req, file, cb) => {
        let newFileName = "submit.wav";
        cb(null, newFileName)
    },
})


const upload = multer({storage:storage});
const router = express.Router();
const {getSentences,getTypeEnum,putSentences,postCategory,pronounceEval,putSentencesFromPhoto} = require('../../controllers/sentences.js')
const {authChecker} = require('../../middlewares');

router.get('/list/:category?/:selectedCharacter?',authChecker,getSentences)

router.get('/category',authChecker,getTypeEnum)

router.post('/category',authChecker,postCategory)
router.put('/insert',authChecker,putSentences)

router.post('/submit',upload.single('data'),authChecker,pronounceEval)


module.exports = router;
