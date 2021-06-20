//FILENAME : Applicant.js

const mongoose = require("mongoose");

const ApplicantSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cgpa: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    offer: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// export model user with UserSchema
module.exports = mongoose.model("applicant", ApplicantSchema);
