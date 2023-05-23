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

exports.putSentences = async (req,res)=>{
    try{
        //Schema - EnumValues를 쓰지 않는 이유 : User마다 Sentence Category의 EnumValues가 다르고, 이를 정적인 Schema에 적용할 수 없기 때문이다.
        let user = await User.findOne({kakao_id:req.body.request_id});
        if(user){
            let data = req.body;
            delete data.request_id;
            data.userId = user.id;
            if(user.category_enum.includes(data.category)){
                Sentence.collection.insertOne(data,function(err){
                   if(err){
                    console.log(err);
                    res.status(500).json({success:0,message:'Duplicate Key'});
                   }else{
                    res.status(200).json({success:1,message:'Insert Successful'})
                   }
                })
            }else{
                res.status(500).json({message : `User does not have category : ${data.category}. Please add ${data.category} category to this User`})
            }
        }else{
            res.status(500).json({message : 'There is no user for your Token'})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: error, message:'DB Side Error'})
    }
}

