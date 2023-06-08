const express = require('express');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../All-Bareumi_AI/Wav2Lip/my_data')
    },
    filename: (req, file, cb) => {
        let newFileName = "myAvatar.png";
        cb(null, newFileName)
    },
})
const upload = multer({storage:storage});
const {create_user_character} = require('../../controllers/sentences.js')
const { user_info, user_photo, set_user_goal,todayReport, isGoalAchived, rewardList, nearestReward, postReward,achivedReward} = require('../../controllers/auth.js');
const {authChecker} = require('../../middlewares');
const router = express.Router();

// POST /auth/login

router.get('/me',authChecker,user_info);

router.post('/set/goal',authChecker,set_user_goal);

router.post('/photos/upload',upload.single('data'),authChecker,user_photo,create_user_character);

router.get('/today/report',authChecker,todayReport);

router.get('/today/goal/achived',authChecker,isGoalAchived)

router.get('/reward/list',authChecker,rewardList)

router.get('/reward/nearest',authChecker,nearestReward)

router.post('/reward',authChecker,postReward)

router.get('/reward/achived',authChecker,achivedReward)

module.exports = router;
