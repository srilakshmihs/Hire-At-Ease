//FILENAME : Notification.js

const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
   
    messageto: {
        type: String,
        required: true
    },
    announcement: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

// export model user with NotificationSchema
module.exports = mongoose.model("notification", NotificationSchema);
