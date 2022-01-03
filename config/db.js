//FILENAME : db.js

const mongoose = require("mongoose");
const {MONGOURI} = require("./config");

const InitiateMongoServer = async () => {
  console.log("Trying to connect to Mongo")
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log("Failer to connect");
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;