const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  twoFactorId: String,
  twoFactorEnabled: { type: Boolean, default: false },
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
