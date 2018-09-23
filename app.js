var express = require("express");
var app = express();
var port = 3001;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useMongoClient: true
};

// const mongoURI = process.env.MONGODB_URI;
mongoose.connect("mongodb://localhost:27017/user-management", option).then(function(){
    console.log("connected")
}, function(err) {
    //err handle
    console.log('//err handle: ', err);
});

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});
var User = mongoose.model("User", nameSchema);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/signup", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("User saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});