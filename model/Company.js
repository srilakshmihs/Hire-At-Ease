//FILENAME : Company.js

const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
    companyname: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    package: {
        type: String,
        required: true,
    },
    cutoff: {
        type: String,
        required: true,
    },
    candidates: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// export model user with UserSchema
module.exports = mongoose.model("company", CompanySchema);
