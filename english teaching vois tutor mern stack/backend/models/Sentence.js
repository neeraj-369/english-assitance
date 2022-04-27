const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sentence Schema
const SentenceSchema = new Schema({
    s_id: {
        type: String,
        required: true
    },
    vois_tutor_id: {
        type: String,
        required: true,
    },
    sentence: {
        type: String,
        required: true
    },
    cls: {
        type: Number,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    expertAudio : {
        type: String
    }
});

module.exports = Sentence = mongoose.model('Sentence', SentenceSchema);
