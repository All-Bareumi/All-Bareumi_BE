const mongoose = require('mongoose')

const {Schema} = mongoose;
const ObjectId = Schema.ObjectId
const sentenceSchema = new Schema({
    type: { type: String, enum: ['default', 'user'], default: 'default' },
    content: { type: String, required: true },
    category:{ type: String, required: true },
    videoPath : {type: String, required: false},
    userId : {type : ObjectId, required: false }
    
})

sentenceSchema.index({content:1,userId:1},{unique:true})
module.exports = mongoose.model('Sentence',sentenceSchema)