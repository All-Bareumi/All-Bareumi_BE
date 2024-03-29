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

var rewardSchema = new Schema({
    count:{
        type : Number,
        required : true
    },
    goal_type:{
        type:String,
        required : true,
        enum : ['문장','일'],
        default:'문장'        
    },
    reward : {
        type : String,
        required : true
    },
    achivement:{
        type: Number,
        required:true,
        default:0
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
    hasAvatar:{
        type:Boolean,
        required : true,
        default : false
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
    },
    user_rewards:{
        type : [rewardSchema],
        required: true,
        default:[{
            count:30,
            goal_type:'문장',
            reward: '치킨'
        }]
    },
    achived_rewards:{
        type:[rewardSchema],
        required:true,
        default:[]
    }

})



module.exports = mongoose.model('User',userSchema)