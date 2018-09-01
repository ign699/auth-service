const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: String,
  password: String,
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
