const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    name: String,
    password: String,
    ip: String,
    profile: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;