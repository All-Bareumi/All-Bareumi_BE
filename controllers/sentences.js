const sentences = require('../models/sentences.js')
const Sentence = require('../models/sentences.js')
const User = require('../models/user.js')

exports.getSentences = async(req,res)=>{
    try{
        const category = req.params.category
        let sentences = {}
        if(category){
            let user = await User.findOne({'kakao_id' : req.body.request_id});
            sentences= await Sentence.find({'category': category}).or([{type:'default'},{userId:user.id}]);
        }
        else{
            sentences = await Sentence.find({});
        }
        res.status(200).json(sentences)
    } catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error'})
    }
}

exports.getTypeEnum = async(req,res)=>{
    try{
        const user = await User.findOne({'kakao_id' : req.body.request_id});
        res.status(200).send(user.category_enum);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error'})
    }
}

exports.putSentences = (req,res)=>{
    try{
        const data = new Sentence(req.body);
        data.save(function(err){
            if(err){
                console.log(err);
                res.json({success:0,message:'Insert Failed'});
            }else res.json({success:1,message:'Insert Success'})
        }) 
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'})
    }
}

