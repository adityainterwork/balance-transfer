var express = require('express');
var app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 7000;
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
const notifier = require('node-notifier');
const mongoose = require('mongoose')
const UserModel = require('./model/model')

var Chart = require('chart.js');
var cors = require('cors')
app.use(cors())
var moment = require('moment');
var localStorage = require('localStorage')
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"))



app.listen(PORT, () => {
    console.log(`working on ${PORT}`);

})
app.get('/home', (req, res) => {
    console.log('home');
    res.render('home')

});

app.post('/transfer', (req, res) => {

    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    const token = req.body.token;
    let url_ = "http://localhost:4000/channels/mychannel/chaincodes/mycc";

    var body = {
        "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
        "fcn": "move",
        "args": [sender, receiver, amount]
    };

    request({
        url: url_,
        method: "POST",
        json: true, // <--Very important!!!
        body: body,
        headers: {
            "authorization": "Bearer " + token,
            "content-type": "application/json"
        }
    }, function (error, response, body) {
        var x;
        if (body) {
            localStorage.setItem('my_token', token)
            var body_ = JSON.stringify(body, null, 4);
            x = JSON.parse(body_)

            notifier.notify({
                title: 'Sucessful',
                message: x.message,
                sound: true
            });
        }

        if (error) {
            console.log(`Error:${error}`);
        }

        res.render('home', {
            result: x.message
        })
    });

})

app.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

})


app.get('/transaction', (req, res) => {
    var DATAVALUE = [];
    var TIME = [];
    var sender = req.body.sender;
    let url_ = "http://localhost:4000/channels/mychannel/chaincodes/mycc";
    const token = localStorage.getItem('my_token')
    var body = {
        "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
        "fcn": "getHistoryForTransaction",
        "args": ["a"]
    };

    request({
        url: url_,
        method: "POST",
        json: true, // <--Very important!!!
        body: body,
        headers: {
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTEyODcyNTksInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTEyNTEyNTl9.yIkVDSWCIUtDCYv3jc1lXhrhpKxDqoq0gEKVpWD60BU" ,
            "content-type": "application/json"
        }
    }, function (error, response, body) {
        var x;
        if (body) {
            var body_ = JSON.stringify(body, null, 4);
            x = JSON.parse(body_)
        }

        if (x.transaction) {
            for (i = 0; i < x.transaction.length; i++) {
                DATAVALUE[i] = x.transaction[i].Value;
                var z = x.transaction[i].Timestamp;

                var tmp = z.substring(0, 19)
                TIME[i] = tmp;
                console.log(TIME[i]);
            }
        }

        res.render('transaction', {
            data: DATAVALUE,
            time: TIME
        })

        if (error) {
            console.log(`Error:${error}`);
        }


    });





})

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/passport-jwt')
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));