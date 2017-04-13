var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SALT = 10;

var trainerSchema = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true},
  hashedPassword: {type: String, required: true}
});

trainerSchema.pre('save', function (next) {
  var trainer = this;

  // only hash if password is new
  if (!trainer.isModified('hashedPassword')) return next();

  // generaet salt
  bcrypt.genSalt(SALT, function (err, salt) {
    if (err) return next(err);

    // hash password with our new salt
    bcrypt.hash(trainer.hashedPassword, salt, function (err, hash) {
      if (err) return next(err);

      // override the plaintext password with the hashed password
      trainer.hashedPassword = hash;
      next();
    });
  });
});

trainerSchema.methods.isValidPassword = function (password, cb) {
  bcrypt.compare(password, this.hashedPassword, function (err, isMatch) {
    cb(isMatch);
  });
};

module.exports =  mongoose.model("Trainer", trainerSchema);
