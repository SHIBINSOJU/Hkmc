const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    hearts: { type: Number, default: 10 }, // Lifesteal default
    balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', playerSchema);
