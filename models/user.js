const mongoose = require('mongoose')

const {Schema} = mongoose;
const userSchema = new Schema({
    nickname:{
        type: String,
        required: true,
        unique:  false,
    },
    kakao_id:{
        type: Number,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        required: true,
        unique : false,
        enum : ['male','female']
    },
    photo_data:{
        type:String,
        required: false,
        unique: false
    },
    profile_image_data:{
        type:String,
        required: false,
        unique: false
    }


})



module.exports = mongoose.model('User',userSchema)