var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var validator = require('mongoose-validators');
var bcrypt = require("bcrypt");
var passport = require("passport");
var passportLocal = require("passport-local");
var session = require("express-session");
var Trainer = require("./public/Models/trainer");

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://jeffhabs:password@ds119020.mlab.com:19020/myfitnessapp");
// local database
//mongoose.connect("mongodb://localhost:27017/MyFitnessApp");

var Schema = mongoose.Schema;

function dummyEmailValidator(candidate) {
  return candidate === 'jeffrey.haberle@gmail.com'
}

var clientSchema = new Schema({
  _owner: {
     type: Schema.Types.ObjectId,
     ref: 'Trainer'
  },
  firstname: {type: String, required: true, unique: false, validate: validator.isAlpha()},
  lastname: {type: String, required: true, validate: validator.isAlpha()},
  email: {type: String, required: true, validate: validator.isEmail()},
  age: {type: Number, required: true, validate: validator.isNumeric()},
  weight: {type: Number, required: true, validate: validator.isNumeric()},
  bodyfat: {type: String, required: true},
  address: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  postalCode: {type: String, required: true, validate: validator.isNumeric()},
  summary: {type: String, required: true},
  phonenumber: {type: String, required: true},
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
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(preflight);

// ROURTER
// GET ALL CLIENTS
app.get("/clients", function (req, res) {
  if (req.user) {
    console.log("user id ", req.user._id);
    Client.find({_owner: req.user._id})
    .populate('_owner')
    .exec(function (err, clients) {
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
  } else {
    res.sendStatus(401);
  }
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
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send();
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
    _owner: req.user._id,
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
    // if(!err) {
    //   Client.find({_owner: req.user._id})
    //   .populate('_owner')
    //   .execute(function (err, clients) {
    //     res.sendStatus(201);
    //   });
    // }
    res.sendStatus(201);
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
      console.log("error saving workout", err);
      res.status(500).json(err);
      return err;
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.status(201).json(workout);
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

passport.use(new passportLocal.Strategy({
  usernameField: 'email'
},
function (email, password, done) {
  Trainer.findOne({ email: email }, function (err, trainer) {
    if (err) {
      console.log("error passport local strategy: ", err)
      return done(err);
    }
    if (!trainer) {
      return done(null, false);
    }
    //console.log("trainer passport strategy: ", trainer);
    trainer.isValidPassword(password, function (isMatch) {
      if (isMatch) {
        return done(null, trainer);
      } else {
        console.log("invalid password; did not match");
        return done(null, false);
      }
    });
  });
}));

passport.serializeUser(function (trainer, done) {
  done(null, trainer._id);
});

passport.deserializeUser(function (id, done) {
  Trainer.findById(id, function(err, trainer) {
    done(err, trainer);
  });
});

//AJAX Create Trainer:
app.post('/trainers', function (req, res) {
  var trainer = new Trainer({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      hashedPassword: req.body.password,
  });
  trainer.save(function (err, trainer) {
    if (err) {
      console.log("error posting to trainers ", err);
      res.sendStatus(422);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      console.log("POST: /clients : Success");
      res.sendStatus(201);
    }
  });
});

app.get("/trainers", function (req, res) {
  Trainer.find(function(err, trainers) {
    if (err) {
      res.sendStatus(404);
      return err;
    } else {
      res.status(200);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.json(trainers);
    }
  });
});

app.get("/trainers/:id", function (req, res) {
  console.log("Trainer ID: ", req.params.id);
  Trainer.findById(req.params.id, function (err, found) {
    if (err || found == null) {
      res.sendStatus(404);
      return err;
    }
    //success
    res.status(200);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json(found);
  });
});

app.post("/sessions", passport.authenticate('local'), function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(201);
  res.json(req.user);
});

app.get("/me", function (req, res) {
  if(req.user) {
    res.status(200);
    res.json(req.user);
  } else {
    res.sendStatus(401)
  }
});

app.get("/logout", function (req, res) {
  if(req.user) {
    req.logout();
    res.status(200);
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Server running on port: ", port);
});
