const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "dev-db";
require("dotenv").config();

// routes
var loginRoute = require("./routes/login");
var registerRoute = require("./routes/register");
var teacherRoute = require("./routes/Teacher/info");
var studentRoute = require("./routes/Student/list");
var awsRoute = require("./routes/AWS_Utilities/aws");
var storeRoute = require("./routes/General/store");
//var studentRoute = require("./routes/Students/info");
//var adminRoute = require("./routes/Admin/info");


app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/teacher", teacherRoute);
app.use("/student", studentRoute);
app.use("/aws", awsRoute);
app.use("/store", storeRoute);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

