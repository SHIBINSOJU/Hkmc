const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// IMPORT THE MODEL
const Player = require('./models/Player'); 

const app = express();
const PORT = process.env.PORT || 3000;


// 1. MongoDB Connection
// Note: We don't need 'minecraft-server-util' or 'axios' anymore!
mongoose.connect('mongodb+srv://shibinhussainmk_db_user:4XZujvl0OnCKhdN5@musicbot.3sydv1a.mongodb.net/musicBOT?retryWrites=true&w=majority&appName=musicBOT')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES

// 1. HOME PAGE
app.get('/', async (req, res) => {
    try {
        // A. Get Top Killer
        let leaderboard = await Player.find().sort({ kills: -1 }).limit(1);
        if (leaderboard.length === 0) {
            leaderboard = [{ username: 'No One Yet', kills: 0, hearts: 10 }];
        }

        // B. Get Online Count directly from DB
        // "countDocuments" is very fast. It just counts how many have isOnline: true
        const onlineCount = await Player.countDocuments({ isOnline: true });

        res.render('index', {
            page: 'home',
            online: true, // We assume online if DB is reachable
            players: onlineCount, // Number of people online
            max: 100, // You can set this to your server max
            version: '1.20.x', 
            leaderboard: leaderboard
        });
    } catch (error) {
        console.error(error);
        res.render('index', {
            page: 'home',
            online: false,
            players: 0,
            max: 0,
            version: 'Offline',
            leaderboard: []
        });
    }
});

// 2. LEADERBOARD + LIVE PLAYERS PAGE
app.get('/leaderboard', async (req, res) => {
    try {
        // A. Get Stats (Top 50 Killers)
        const dbPlayers = await Player.find().sort({ kills: -1 }).limit(50);

        // B. Get Online Players (Who is actually playing?)
        // We fetch everyone who is marked "true" in the database
        const onlineDocs = await Player.find({ isOnline: true });
        
        // Convert to simple format for EJS
        const onlineList = onlineDocs.map(p => ({ name: p.username }));

        res.render('leaderboard', { 
            page: 'leaderboard',
            players: dbPlayers,     // Red Table
            livePlayers: onlineList // Green Box
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

// --- HELPER: Reset Database Route ---
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
