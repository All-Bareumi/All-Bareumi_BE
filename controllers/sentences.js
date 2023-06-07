const sentences = require('../models/sentences.js')
const Sentence = require('../models/sentences.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId
const axios = require('axios');
const path = require('path')
exports.getSentences = async (req, res) => { //프론트에 전달 시 ObjectId도 전달해서 나중에 학습 완료 시에 해당 Id 값 제출하게끔 함.
    try {
        const category = req.params.category
        let categoryKOR = ""
        switch(category){
            case "food":
                categoryKOR="음식"
                break;
            case "school":
                categoryKOR="학교"
                break;
            case "family":
                categoryKOR="가족"
                break;
            case "exercise":
                categoryKOR="운동"
                break;
            default:
                categoryKOR = category
                break;
        }
        let sentences = {}
        if (category) {
            let user = await User.findOne({ 'kakao_id': req.body.request_id });
            sentences = await Sentence.find({ 'category': category }).or([{ type: 'default' }, { userId: user.id }]);
        }
        else {
            sentences = await Sentence.find({},{_id:0});
        }
        for(sentence of sentences){
            let filename =sentence.videoPath.split('video/sentence/'+category+'/')[1];
            sentence.videoPath = 'video/sentence/'+category+'/'+req.params.selectedCharacter+'/'+filename
        }
        res.status(200).json({sentences:sentences,category : category,subjectKOR: categoryKOR,subjectImg:'image/icon/icon_'+category+'.png'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getTypeEnum = async (req, res) => {
    try {
        const user = await User.findOne({ 'kakao_id': req.body.request_id });
        res.status(200).send({subjects : user.category_enum});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.postCategory = async(req,res)=>{
    try{
        const user = await User.findOne({ 'kakao_id': req.body.request_id });
        categories = user.category_enum
        if(categories.includes(req.body.category) )
        {
            res.json({success:false,message:`There is already ${req.body.category}  category in User`})
        }
        else{
        categories.push(req.body.category)
        await User.updateOne({ 'kakao_id': req.body.request_id },{'category_enum':categories});
        res.json({success:true});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Put category - Server Error'})
    }
}
exports.pronounceEval = async(req,res)=>{
    try{
    abs_path = path.resolve(req.file.path)
    axios.post('http://localhost:8080//pronounce/evaluation',{
        filename: abs_path,
        sentence : req.body.sentence
    }).then(async result=>{
        const user = await User.findOne({'kakao_id':req.body.request_id});
        let log = {
            sentence_id : req.body.sentence_id,
            score : result.data
        }
        if(user.study_log.recent_date){
            let user_recent_date = user.study_log.recent_date
            let now = new Date()
            if(user_recent_date.toDateString()!=now.toDateString()){
                let time_diff = new Date(now.setHours(0,0,0,0)) - new Date(user_recent_date.setHours(0,0,0,0))
                if(time_diff>=24*60*60*1000){
                    if(time_diff>=48*60*60*1000){
                        user.study_log.study_continuity_cnt=0;
                    }else{
                        user.study_log.study_continuity_cnt +=1;
                    }
                    user.study_log.recent_date = new Date();
                    user.study_log.date_logs.push({
                        date : new Date(new Date().setHours(0,0,0,0)),
                        logs : [log]
                    })
                }  
            }else{
                let today = new Date(new Date().setHours(0,0,0,0));
                user.study_log.date_logs.find(datelog=>datelog.date.getTime() == today.getTime()).logs.push(log); 
            }   
        }else{
            user.study_log.recent_date = new Date();
            user.study_log.date_logs.push({
                date : new Date(new Date().setHours(0,0,0,0)),
                logs : [log]
            })
        }
        let goal_achived = user.goal_amount==user.study_log.date_logs.find(datelog=>datelog.date.getTime() == new Date(new Date().setHours(0,0,0,0)).getTime()).logs.length
        user.save(function(err){
            if(err){
                res.json({success:false,error:err})
            }else{
                res.json({success:true,score:result.data,is_goal_achived: goal_achived})
            }
        })
        
    })
    }catch(err){
        console.log(err);
        res.json({success:false,error:err})
    }
}

exports.putSentences = async (req, res) => {
    try {
        //Schema - EnumValues를 쓰지 않는 이유 : User마다 Sentence Category의 EnumValues가 다르고, 이를 정적인 Schema에 적용할 수 없기 때문이다.
        let user = await User.findOne({ kakao_id: req.body.request_id });
        if (user) {
            let data = req.body;
            data.sentence.type = 'user';
            data.sentence.userId = user._id;
            if(data.character=='anna'||'elsa'){
                data.gender = 'female';
            }else if(data.character=='hans'||'kristoff'){
                data.gender='male'
            }else{
                data.gender = user.gender
            }
            if (user.category_enum.includes(data.sentence.category)) {
                cate_sentences = await Sentence.find({
                    "category": data.sentence.category, $or: [
                        { userId: user._id },
                        { type: "default" }
                    ]
                })
                data.sentence.videoPath = 'video/sentence/'+data.sentence.category+'/'+data.sentence.category+cate_sentences.length+'.mp4'
                Sentence.collection.insertOne(data.sentence, async function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ success: 0, message: 'Duplicate Key' });
                    } else {
                        await axios.post('http://127.0.0.1:8080/sentence/insert', {
                            gender: data.gender,
                            character: data.character+".png",
                            input_text: data.sentence.content,
                            out_path: "video/sentence/"+data.sentence.category+"/"+data.character+"/",
                            filename: data.sentence.category+cate_sentences.length
                        }).then(async result => {
                            console.log(result.data);
                            res.status(200).json({ success: result.data.success,path: result.data.path, message: 'Insert Successful' })
                            characters = ['anna', 'elsa', 'kristoff', 'hans'];
                            for (character of characters) {
                                if (data.character != character) {
                                    await axios.post('http://127.0.0.1:8080/sentence/insert', {
                                        gender: data.gender,
                                        character: character + ".png",
                                        input_text: data.sentence.content,
                                        out_path: "video/sentence/"+data.sentence.category+"/"+character+"/",
                                        filename: data.sentence.category+cate_sentences.length
                                    });
                                }
                            }
                        });
                    }
                })
            } else {
                res.status(500).json({ message: `User does not have category : ${data.sentence.category}. Please add ${data.sentence.category} category to this User` })
            }
        } else {
            res.status(500).json({ message: 'There is no user for your Token' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: 'DB Side Error' })
    }
}

