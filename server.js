const express = require('express');
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const app = express();
const PORT = 3000;
const Player = require('./models/Player');

// 1. MongoDB Connection (Replace with your actual MongoDB URI)
mongoose.connect('mongodb+srv://shibinhussainmk_db_user:4XZujvl0OnCKhdN5@musicbot.3sydv1a.mongodb.net/?retryWrites=true&w=majority&appName=musicBOT', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// 2. Define a "Player" Schema for your Leaderboard
const playerSchema = new mongoose.Schema({
    username: String,
    kills: Number,
    hearts: Number, // Crucial for Lifesteal
    balance: Number
});
const Player = mongoose.model('Player', playerSchema);

// Configuration
const SERVER_IP = 'play.hkmc.fun'; 
const SERVER_PORT = 25565; 

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    // Fake Leaderboard Data (Since we don't have real players yet)
    // In the future, your plugin will save to MongoDB, and this line will read it.
    const topKillers = [
        { username: 'Rizx', kills: 154, hearts: 20 },
        { username: 'Viper', kills: 132, hearts: 18 },
        { username: 'Shadow', kills: 98, hearts: 5 }
    ];

    
    
    try {
        const status = await util.status(SERVER_IP, SERVER_PORT);
        res.render('index', {
            page: 'home',
            online: true,
            players: status.players.online,
            max: status.players.max,
            version: status.version.name,
            leaderboard: topKillers
        });
    } catch (error) {
        res.render('index', {
            online: false,
            players: 0,
            max: 0,
            version: 'N/A',
            leaderboard: topKillers
        });
    }
});

app.listen(PORT, () => console.log(`🚀 HKMC Website live at http://localhost:${PORT}`));
