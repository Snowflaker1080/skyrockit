const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // properties of applications
  company: { type: String, require: true },
  title: { type: String, required: true },
  notes: { type: String },
  postingLink: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["interested", "applied", "interviewing", "rejected", "accepted"],
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applications: [applicationSchema], // embed applicationSchema here
});

const User = mongoose.model('User', userSchema);

module.exports = User;
