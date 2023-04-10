const express = require('express');
const router = express.Router();
const {getSentences,getTypeEnum} = require('../../controllers/sentences.js')

router.get('/list/:category?',getSentences)

router.get('/schema/:schema',getTypeEnum)

router.get('/test/:test',(req,res)=>{
    res.send(req.params.test)
})
module.exports = router;
