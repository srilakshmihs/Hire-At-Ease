//FILENAME : Resources.js

const mongoose = require("mongoose");

const ResourcesSchema = mongoose.Schema({
   
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

// export model user with NotificationSchema
module.exports = mongoose.model("resources", ResourcesSchema);
