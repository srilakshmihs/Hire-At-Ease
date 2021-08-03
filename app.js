const express = require("express");
const user = require("./routes/user");
const admin =require("./routes/admin")

const student = require("./routes/student");

const InitiateMongoServer = require("./config/db");
const path = require('path');
const {PORT} = require("./config/config");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

app.use("/public", express.static(__dirname+'/public'));

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname,'./views/index.html'))
});

app.get("/bot", (req, res) => {
  res.sendFile(path.resolve(__dirname,'./public/fu/bot.html'))
});

app.use("/user", user);

app.use("/admin", admin);

app.use("/student", student);

app.use('*',(req,res) => {
  res.send("Error 404")
})

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});