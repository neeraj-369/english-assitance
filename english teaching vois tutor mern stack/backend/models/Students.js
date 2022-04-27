const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Students Schema
const StudentsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rollno: {
        type: Number,
        required: true
    },
    contact : {
        type : String
    },
    address : {
        type : String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    practiceChapter: {
        type: String,
        required: false,
        default: "1A"
    },
    classChapter: {
        type: String,
        required: false,
        default: "1A"
    },
    cls: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    practiceProgress: {
        type: Number,
        default: 0
    },
    classRecord: [{
        chapter: {
            type: String,
        },
        record: [{
            sentence: {
                type: String
            },
            result: {
                stress: {
                    type: Number,
                },
                fluency: {
                    type: Number
                },
                pass : {
                    type : String
                }
            },
        }],
        
    }],
    selftests: [{
        chapter: {
            type: String
        },
        record: [{
            sentence: {
                type: String
            },
            result: {
                stress: {
                    type: Number,
                },
                fluency: {
                    type: Number
                },
                pass : {
                    type : String
                }
            }
        }]
    }]
});

module.exports = Student = mongoose.model('Students', StudentsSchema);
