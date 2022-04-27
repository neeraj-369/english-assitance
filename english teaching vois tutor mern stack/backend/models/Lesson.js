const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedLessonSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    cls : {
        type: String,
        required: true,
    },
    chapter: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    sdetails: [{
        s_id:{
            type: String
        },
        sentence:{
            type: String
        }
    }]
})

module.exports = SavedLesson = mongoose.model('SavedLessons', SavedLessonSchema);