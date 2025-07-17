const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  token: String,
  pp: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
