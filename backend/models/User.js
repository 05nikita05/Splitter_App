// models/user.js
const mongoose = require('mongoose');

// User Schema for storing user information
const userSchema = new mongoose.Schema({
  email:  {type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const User = mongoose.models.User || mongoose.model('User', userSchema); // Avoid overwriting the model

module.exports = User; // Export the User model
