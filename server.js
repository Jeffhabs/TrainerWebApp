var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));


mongoose.connect("mongodb://localhost:27017/MyFitnessApp");


var Schema = mongoose.Schema;

var clientSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  age: Number,
  weight: Number,
  bodyfat: String,
  goal: String,
  phonenumber: String,
  address: String,
  avatar: String
});

var Client = mongoose.model('Client', clientSchema);

// MIDDLEWARE
var preflight = function(req, res, next) {
  if ('OPTIONS' == req.method) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(preflight);


// Router
app.get("/clients", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  Client.find(function(err, clients) {
    if (err) { return (err) }
    res.json(clients);
  });
});

app.delete("/clients", function (req, res, next) {
  Client.remove({}, function (err) {
    if (err) { return handleError(err); }
    res.header("Access-Control-Allow-Origin", "*");
    res.sendStatus(204);
    console.log("Successfully deleted all clients");
  });
});

app.post("/clients", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var client = new Client({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    age: req.body.age,
    weight: req.body.weight,
    bodyfat: req.body.bodyfat,
    goal: req.body.goal,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    avatar: req.body.avatar
  })
  client.save(function (err, client) {
    if (err) {
      res.status(500);
      return err
    } else {
      res.status(201);
      res.json(client);
    }
  })
});

app.listen(8080, function () {
  console.log("Server running on port 8080");
});
