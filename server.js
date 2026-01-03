const express = require('express');
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const path = require('path');
const axios = require('axios'); // Required for "Online Now" fix

// IMPORT THE MODEL
const Player = require('./models/Player'); 

const app = express();
const PORT = 3000;

// 1. MongoDB Connection
mongoose.connect('mongodb+srv://shibinhussainmk_db_user:4XZujvl0OnCKhdN5@musicbot.3sydv1a.mongodb.net/musicBOT?retryWrites=true&w=majority&appName=musicBOT')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Configuration
const SERVER_IP = '148.113.5.96'; 
const SERVER_PORT = 25566; 

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES

// 1. HOME PAGE
app.get('/', async (req, res) => {
    // 1. Fetch Real Top Killer (Live Update)
    // This grabs the player with the HIGHEST kills from MongoDB
    let leaderboard = await Player.find().sort({ kills: -1 }).limit(1);

    // Fallback: If database is completely empty (new server)
    if (leaderboard.length === 0) {
        leaderboard = [
            { username: 'No One Yet', kills: 0, hearts: 10 }
        ];
    }

    try {
        // 2. Fetch Server Status (With 5 Second Timeout to fix flickering)
        const status = await util.status(SERVER_IP, SERVER_PORT, { 
            timeout: 5000, // Wait 5 seconds before saying offline
            enableSRV: true 
        });

        res.render('index', {
            page: 'home',
            online: true,
            players: status.players.online,
            max: status.players.max,
            version: status.version.name,
            leaderboard: leaderboard // This sends .Lynx1937 to the page
        });

    } catch (error) {
        // If server is truly offline (or takes > 5 seconds)
        res.render('index', {
            page: 'home',
            online: false,
            players: 0,
            max: 0,
            version: 'Offline',
            leaderboard: leaderboard
        });
    }
});

// 2. LEADERBOARD + LIVE PLAYERS PAGE
app.get('/leaderboard', async (req, res) => {
    try {
        // A. Fetch All Stats from Database (Sorted by kills)
        const dbPlayers = await Player.find().sort({ kills: -1 }).limit(50);

        // B. Fetch LIVE Status from Public API (Fixes "Online Now 0" Bug)
        let onlineList = []; 
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}:${SERVER_PORT}`);
            
            if (response.data.online && response.data.players && response.data.players.list) {
                onlineList = response.data.players.list; 
            }
        } catch (e) {
            console.log("Could not fetch live players from API:", e.message);
        }

        res.render('leaderboard', { 
            page: 'leaderboard',
            players: dbPlayers,     // Database History (Red Table)
            livePlayers: onlineList // Real-time Online (Green Heads)
        });

    } catch (err) {
        console.error(err);
        res.send("Error loading leaderboard");
    }
});

// 3. STORE PAGE
app.get('/store', (req, res) => {
    res.render('coming-soon', { pageName: 'store', page: 'store' });
});

// 4. VOTE PAGE
app.get('/vote', (req, res) => {
    res.render('coming-soon', { pageName: 'vote', page: 'vote' });
});

// 5. DONATE PAGE
app.get('/donate', (req, res) => {
    const recentDonors = [
        { name: 'Zilsila', amount: '₹500' }, 
        { name: 'Shibinsoju', amount: '₹100' }
    ];

    res.render('donate', { 
        page: 'donate',
        donors: recentDonors
    });
});

// --- HELPER: Reset Database Route (Use carefully!) ---
app.get('/reset-stats', async (req, res) => {
    try {
        await Player.deleteMany({}); 
        res.send("✅ Database Wiped! Restart server to track real stats.");
    } catch (e) {
        res.send("Error wiping DB: " + e.message);
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 HKMC Website live at http://localhost:${PORT}`);
});
