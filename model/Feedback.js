//FILENAME : Feedback.js

const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    companyFeedBack: {
        type: String,
        required: true
    },
    feedBackText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

// export model user with NotificationSchema
module.exports = mongoose.model("feedback", FeedbackSchema);
