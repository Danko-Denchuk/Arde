const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const { SerialPort } = require('serialport');

app.use(express.static('public'));


let db;
const url = 'mongodb://clicks:clicks@localhost:27017/clicks.clicks';
var port = 8080;

MongoClient.connect(url, (err, clicks)=>{
    if(err){
        return console.log(err);
    }
    db=clicks;
    app.listen(port, ()=>{
        console.log('listening on ' + port);
    });
});


var arduinoCOMPort = "COM5";

var arduinoSerialPort = new SerialPort({ path: arduinoCOMPort, baudRate: 9600 });

arduinoSerialPort.on('open', function () {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

// app.get('/', function (req, res) {

//     return res.send('Working');

// })

// app.get('/:action', function (req, res) {

//     var action = req.params.action || req.param('action');

//     if (action == 'led') {
//         arduinoSerialPort.write("o");
//         return res.send('Led light is on!');
//     }
//     if (action == 'off') {
//         arduinoSerialPort.write("f");
//         return res.send("Led light is off!");
//     }

//     return res.send('Action: ' + action);

// });

// app.listen(port, function () {
//     console.log('Example app listening on port http://0.0.0.0:' + port + '!');
// });

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// get the click data from the database
app.get('/clicks', (req, res) => {

    db.collection('clicks').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
    const click = { clickTime: new Date() };
    console.log(click);
    console.log(db);

    db.collection('clicks').save(click, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('click added to db');
        res.sendStatus(201);
    });
});