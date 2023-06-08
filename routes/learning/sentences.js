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
const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../All-Bareumi_AI/Flask')
    },
    filename: (req, file, cb) => {
        let newFileName = "submit.jpg";
        cb(null, newFileName)
    },
})


const upload = multer({storage:storage});
const upload2 = multer({storage:storage2});
const router = express.Router();
const {getSentences,getTypeEnum,putSentences,postCategory,pronounceEval,putSentencesFromPhoto} = require('../../controllers/sentences.js')
const {authChecker} = require('../../middlewares');

router.get('/list/:category?/:selectedCharacter?',authChecker,getSentences)

router.get('/category',authChecker,getTypeEnum)

router.post('/category',authChecker,postCategory)
router.put('/insert',authChecker,putSentences)

router.post('/submit',upload.single('data'),authChecker,pronounceEval)

router.post('/submit/ocr',upload2.single('data'),authChecker,putSentencesFromPhoto)



module.exports = router;
