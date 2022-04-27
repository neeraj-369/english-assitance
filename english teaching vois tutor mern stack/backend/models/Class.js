const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Class Schema
const ClassSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fluency: {
        type: Number,
        default: 0.0
    },
    count: {
        type: Number,
        default: 0
    },
    stress: {
        type: Number,
        default: 0.0
    },
    progress: {
        type: Number,
        default: 0
    },
    classRecord: [{
        chapter: {
            type: Number,
        },
        progress : {
            type : Number
        },
        record : [{
            sentence: {
                type: String
            },
            result: {
                stress: {
                    type: Number,
                },
                fluency: {
                    type: Number
                }
            }
        }],
        pass : {
            type : String
        }
    }]
});


module.exports = classRecord = mongoose.model('Class', ClassSchema);
