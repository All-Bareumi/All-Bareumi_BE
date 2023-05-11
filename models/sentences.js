const mongoose = require('mongoose')

const {Schema} = mongoose;
const sentenceSchema = new Schema({
    info: {
        type: { type: String, enum: ['default', 'user'], default: 'default' },
        content: { type: String, required: true },
        category:{ type: String, enum: ['food','school','family','sports'], required: true }
    },
    videoData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    },
})

module.exports = mongoose.model('Sentence',sentenceSchema)