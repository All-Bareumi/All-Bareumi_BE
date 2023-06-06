const sentences = require('../models/sentences.js')
const Sentence = require('../models/sentences.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId
const axios = require('axios');
exports.getSentences = async (req, res) => { //프론트에 전달 시 ObjectId도 전달해서 나중에 학습 완료 시에 해당 Id 값 제출하게끔 함.
    try {
        const category = req.params.category
        let sentences = {}
        if (category) {
            let user = await User.findOne({ 'kakao_id': req.body.request_id });
            sentences = await Sentence.find({ 'category': category }).or([{ type: 'default' }, { userId: user.id }]);
        }
        else {
            sentences = await Sentence.find({},{_id:0});
        }
        res.status(200).json({sentences:sentences})
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

exports.putSentences = async (req, res) => {
    try {
        //Schema - EnumValues를 쓰지 않는 이유 : User마다 Sentence Category의 EnumValues가 다르고, 이를 정적인 Schema에 적용할 수 없기 때문이다.
        let user = await User.findOne({ kakao_id: req.body.request_id });
        if (user) {
            let data = req.body;
            data.sentence.type = 'user';
            data.sentence.userId = user._id;
            if (user.category_enum.includes(data.sentence.category)) {
                cate_sentences = await Sentence.find({
                    "category": data.sentence.category, $or: [
                        { userId: user._id },
                        { type: "default" }
                    ]
                })
                Sentence.collection.insertOne(data.sentence, async function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ success: 0, message: 'Duplicate Key' });
                    } else {
                        await axios.post('http://localhost:8080/sentence/insert', {
                            gender: data.gender,
                            character: data.character+".png",
                            input_text: data.sentence.content,
                            out_path: "video/sentence/"+data.sentence.category+"/"+data.character+"/",
                            filename: data.sentence.category+cate_sentences.length
                        }).then(result => {
                            console.log(result.data);
                            res.status(200).json({ success: result.data.success,path: result.data.path, message: 'Insert Successful' })
                            characters = ['anna', 'elsa', 'kristoff', 'hans'];
                            for (character of characters) {
                                if (data.character != character) {
                                    axios.post('http://localhost:8080/sentence/insert', {
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

