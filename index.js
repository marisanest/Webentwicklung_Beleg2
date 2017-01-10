var express = require('express');
var bodyParser = require('body-parser')
var DataStorage = require("./DataStorage");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;
var dataStorage = new DataStorage("technologies.json", "fluid.json");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/index/styles.css', (req, res) => {
    res.sendFile(__dirname + '/client/css/styles.css');
});

app.get('/images/headerdot.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/headerdot.svg');
});

app.get('/images/help.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/help.svg');
});

app.get('/images/info.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/info.svg');
});

app.get('/images/Reset.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/Reset.svg');
});

app.get('/images/Rotamass3.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/Rotamass3.svg');
});

app.get('/images/headerdotDown.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/headerdotDown.svg');
});

app.get('/images/GenerateDataSheet.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/GenerateDataSheet.svg');
});

app.get('/images/FilterGrip.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/FilterGrip.svg');
});

app.get('/images/FilterBackground.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/FilterBackground.svg');
});

app.get('/images/Calculate.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/Calculate.svg');
});

app.get('/Rotamass3.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/Rotamass3.svg');
});

app.get('/RamcRakd.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/RamcRakd.svg');
});

app.get('/RagnRaqn.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/RagnRaqn.svg');
});

app.get('/YewFloDy.svg', (req, res) => {
    res.sendFile(__dirname + '/client/images/YewFloDy.svg');
});

app.get('/index/images/DropDownSmall.png', (req, res) => {
    res.sendFile(__dirname + '/client/images/DropDownSmall.png');
});

app.get('/index/images/DropDownDark.png', (req, res) => {
    res.sendFile(__dirname + '/client/images/DropDownDark.png');
});

app.get('/index/images/DropDownBig.png', (req, res) => {
    res.sendFile(__dirname + '/client/images/DropDownBig.png');
});

app.get('/images/CheckBox.png', (req, res) => {
    res.sendFile(__dirname + '/client/images/DropDownBig.png');
});

app.get('/api/technologies', (req, res) => {

  var data = dataStorage.getTechnologies();
  res.status(200).send();

  io.emit("technologiesRequested", data);
});

app.get('/api/fluids', (req, res) => {

  console.log("GET /api/fluids" )
  var fluidType = req.query.fluidType;

  if (fluidType != "liquid" && fluidType != "gas") {
      res.status(400).send("No or invalid fluidType");
      return;
  }

  var data = dataStorage.getFluidsByType(fluidType);
  res.status(200).send();
  console.log("DATA ==" + data )
  io.emit("fluidsRequested", data);
});

server.listen(port);
