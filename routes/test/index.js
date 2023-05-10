const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("HTTP GET REQUEST SUCCESS");
})

router.post('/',(req,res)=>{
    console.log(req.body.name);
    if(req.body.name ==null){
        res.send("THERE IS NO REQUEST NAME DATA");
    }else{
        var input_data = req.body.name
        res.send(`YOU SEND POST REQUEST WITH NAME : ${input_data}`);
    }
})


module.exports = router