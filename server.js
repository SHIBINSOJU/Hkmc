const express = require('express');
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const path = require('path');

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
    // Live Top Killer Update
    let leaderboard = await Player.find().sort({ kills: -1 }).limit(1);

    if (leaderboard.length === 0) {
        leaderboard = [{ username: 'No One Yet', kills: 0, hearts: 10 }];
    }

    try {
        // Fetch Status with 5s Timeout (Fixes "Offline" flickering)
        const status = await util.status(SERVER_IP, SERVER_PORT, { 
            timeout: 5000, 
            enableSRV: true 
        });

        res.render('index', {
            page: 'home',
            online: true,
            players: status.players.online,
            max: status.players.max,
            version: status.version.name,
            leaderboard: leaderboard
        });
    } catch (error) {
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

// 2. LEADERBOARD + LIVE PLAYERS PAGE (DIRECT QUERY FIX)
app.get('/leaderboard', async (req, res) => {
    try {
        // A. DB STATS (Red Table)
        const dbPlayers = await Player.find().sort({ kills: -1 }).limit(50);

        // B. LIVE PLAYERS (Green Box) - DIRECT QUERY METHOD
        let onlineList = []; 
        try {
            // "queryFull" bypasses the simple ping and asks for the real list
            const status = await util.queryFull(SERVER_IP, SERVER_PORT);
            
            if (status.players.list && status.players.list.length > 0) {
                // The query returns a simple list of names ['Rizx', 'Shadow']
                // We convert it to objects [{name:'Rizx'}] so your EJS file understands it
                onlineList = status.players.list.map(name => ({ name: name }));
            }
        } catch (e) {
            console.log("Query failed (Is enable-query=true?):", e.message);
            
            // Fallback: Try simple status if Query fails
            try {
                const simple = await util.status(SERVER_IP, SERVER_PORT);
                if (simple.players.sample) {
                    onlineList = simple.players.sample;
                }
            } catch (err) {}
        }

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
