const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedAssessmentSchema = new Schema({
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
    details : [{
        sentence: {
            s_id:{
                type: String
            },
            sentence:{
                type: String
            }
        },
        stu : {
            name: {
                type: String
            },
            cls : {
                type: String,
            },
            rollno : {
                type: Number,
            }
        }
    }]
})

module.exports = SavedAssessment = mongoose.model('SavedAssessments', SavedAssessmentSchema);