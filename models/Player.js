const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: String,
    kills: Number,
    deaths: Number,
    hearts: Number,
    balance: Number,
    isOnline: { type: Boolean, default: false } // <--- ADD THIS LINE
});

module.exports = mongoose.model('Player', playerSchema);
