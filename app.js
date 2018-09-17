var express = require("express");
var app = express();
var port = 3000;
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
mongoose.connect("mongodb://localhost:27017/node-demo", option).then(function(){
    console.log("connected")
}, function(err) {
    //err handle
    console.log('//err handle: ', err);
});
// mongoose.connect("mongodb://localhost:27017/node-demo");
// mongoose.connect("mongodb://localhost:27017/node-demo", {
//     socketTimeoutMS: 0,
//     keepAlive: true,
//     reconnectTries: 30
//   });

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});