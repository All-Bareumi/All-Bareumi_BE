const mongoose = require('mongoose')


const {Schema} = mongoose;

var studyLogSchema = new Schema({
    sentence_id:{
        type:Schema.Types.ObjectId,
        required :true
    },
    score : {
        type:Number,
        required: true
    }
})

var dateLogSchema = new Schema({
    date : {
        type: Date,
        required: true,
        default: new Date(new Date().setHours(0,0,0,0))
    },
    logs :{
        type : [studyLogSchema],
        required : true,
        default : []
    }
})

const userSchema = new Schema({
    nickname:{
        type: String,
        required: true,
        unique:  false,
    },
    degree:{
        type:String,
        required : true,
        unique : false,
        default : "발음 병아리"
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
    },
    category_enum:{
        type : Array,
        required: true,
        unique:false,
        default:['food','school','family','exercise']
    },
    goal_amount:{
        type: Number,
        required : true,
        default : 10
    },
    study_log : {
        start_date : {
            type: Date,
            required : true,
            default : new Date(new Date().setHours(0,0,0,0))
        },
        recent_date : {
            type: Date,
            required: false
        },
        study_date_num :{
            type : Number,
            required : false,
        },
        study_continuity_cnt:{
            type: Number,
            required:false,
            default:0
        },
        date_logs:{
            type:[dateLogSchema],
            required: true,
            default : []
        }
    }

})



module.exports = mongoose.model('User',userSchema)