const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Teachers Schema
const TeachersSchema = new Schema({
    name: {
        type: String,
        required: true
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
    dob : {
        type : Date,
        required: true
    },
    classes :[{
        classname : {
            type : String
        },
        starttime : {
            type : String
        },
        endtime : {
            type : String
        }
    }],
    qualification: [{
        type: String,
        required: false
    }],
    experience: [{
        type: String,
        required: false
    }],
    contact : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    image : {
        type : String
    }
});

module.exports = Teacher = mongoose.model('Teachers', TeachersSchema);
