var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('public'));

//mongoose.connect("mongodb://jeffhabs:password@ds119020.mlab.com:19020/myfitnessapp");
//mongoose.connect("mongodb://localhost:27017/MyFitnessApp");
mongoose.connect("mongodb://jeffhabs:password@ds119020.mlab.com:19020/myfitnessapp")

var Schema = mongoose.Schema;

var clientSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  age: Number,
  weight: Number,
  bodyfat: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  summary: String,
  phonenumber: String,
  avatar: String
});

var Client = mongoose.model('Client', clientSchema);

var workoutSchema = new Schema({
  _owner: { type: Schema.Types.ObjectId, ref: 'Client'},
  title: String,
  sets: String,
  reps: String,
  rest: String
});

var Workout = mongoose.model('Workout', workoutSchema);

// MIDDLEWARE
var preflight = function(req, res, next) {
  if ('OPTIONS' == req.method) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "GET, DELETE, POST, PUT");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(preflight);

// ROURTER
// GET ALL CLIENTS
app.get("/clients", function (req, res) {
  Client.find(function(err, clients) {
    if (err) {
      res.sendStatus(404);
      return (err)
    } else {
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(clients);
    }
  });
});

// GET CLIENT BY ID
app.get("/clients/:id", function (req, res) {
  console.log("Client ID:", req.params.id);
  Client.findById(req.params.id, function (error, found) {
    if (error || found == null) {
      res.sendStatus(404);
      return error;
    } else {
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(found);
    }
  });
});

// DELETE ALL CLIENTS FOR TESTING PURPOSES -- DO NOT USE
app.delete("/clients", function (req, res, next) {
  Client.remove({}, function (err) {
    if (err) { return handleError(err); }
    res.header("Access-Control-Allow-Origin", "*");
    res.sendStatus(204);
    console.log("Successfully deleted all clients");
  });
});

// DELETE CLIENT BY ID
app.delete("/clients/:id", function (req, res) {
  Client.findByIdAndRemove(req.params.id, function (err) {
    if (err ) {
      res.sendStatus(404);
      return err;
    } else {
      res.status(200).send();
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      console.log("successfully removed client");
    }
  });
});

app.put("/clients/:id", function (req, res) {
  Client.findById(req.params.id, function (error, client) {
    if (error || client == null) {
      res.sendStatus(404);
      return error;
    } else {
      client.firstname = req.body.firstname;
      client.lastname = req.body.lastname;
      client.email = req.body.email;
      client.age = req.body.age;
      client.weight = req.body.weight;
      client.bodyfat = req.body.bodyfat;
      client.address = req.body.address;
      client.city = req.body.city;
      client.state = req.body.state;
      client.postalCode = req.body.postalCode;
      client.summary = req.body.summary;
      client.phonenumber = req.body.phonenumber;
      client.avatar = req.body.avatar;

      client.save( function (error, updatedClient) {
        if (error) {
          res.sendStatus(404);
          return error;
        } else {
          res.status(200);
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.json(updatedClient);
          console.log("client updated successfully");
        }
      });
    }
  });
});

// CREATE CLIENT
app.post("/clients", function (req, res) {
  var client = new Client({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    age: req.body.age,
    weight: req.body.weight,
    bodyfat: req.body.bodyfat,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    summary: req.body.summary,
    phonenumber: req.body.phonenumber,
    avatar: req.body.avatar
  });
  client.save(function (err, client) {
    if (err) {
      res.sendStatus(500);
      return err
    } else {
      res.status(201);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(client);
    }
  });
});


app.post("/clients/:id/workouts", function (req, res) {
  console.log("id: ", req.params.id);
  var workout = new Workout({
    _owner: req.params.id,
    title: req.body.title,
    sets: req.body.sets,
    reps: req.body.reps,
    rest: req.body.rest
  })
  workout.save( function (err, workout) {
    if (err) {
      console.log("error saving workout");
      res.sendStatus(500);
      return err;
    } else {
      res.status(201);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(workout);
    }
  });
});

//GET WORKOUTS
app.get("/clients/:id/workouts", function (req, res) {
  Workout.find({_owner: req.params.id})
  .populate('_owner')
  .exec(function (err, workout) {
    if (err) {
      res.sendStatus(404);
      console.log("error getting client/id/workouts", error)
    } else {
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(workout);
    }
  });
});

app.delete("/workouts/:clientId", function (req, res) {
  Workout.findByIdAndRemove(req.params.clientId, function (err) {
    if (err) {
      res.sendStatus(404);
      console.log("error deleting workouts/{:clientId}");
    } else {
      console.log("success deleting workouts/{:clientId}");
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send("success");
    }
  });
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Server running on port: ", port);
});
