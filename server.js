const express = require('express');
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const path = require('path');

// IMPORT THE MODEL (This replaces the manual schema definition)
const Player = require('./models/Player'); 

const app = express();
const PORT = 3000;

// 1. MongoDB Connection
// Make sure you have MongoDB installed in Termux (pkg install mongodb)
mongoose.connect('mongodb+srv://shibinhussainmk_db_user:4XZujvl0OnCKhdN5@musicbot.3sydv1a.mongodb.net/?retryWrites=true&w=majority&appName=musicBOT')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Configuration
const SERVER_IP = 'play.hkmc.fun'; 
const SERVER_PORT = 25565; 

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', async (req, res) => {
    // 1. Try to fetch real top killer from Database
    // (If DB is empty, it uses the fallback list below)
    let leaderboard = await Player.find().sort({ kills: -1 }).limit(1);

    if (leaderboard.length === 0) {
        leaderboard = [
            { username: 'Rizx', kills: 154, hearts: 20 }, // Fallback/Fake data for now
        ];
    }

    try {
        const status = await util.status(SERVER_IP, SERVER_PORT);
        res.render('index', {
            page: 'home',
            online: true,
            players: status.players.online,
            max: status.players.max,
            version: status.version.name,
            leaderboard: leaderboard
        });
    } catch (error) {
        // If server is offline
        res.render('index', {
            page: 'home',
            online: false,
            players: 0,
            max: 0,
            version: 'N/A',
            leaderboard: leaderboard
        });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 HKMC Website live at http://localhost:${PORT}`);
});
